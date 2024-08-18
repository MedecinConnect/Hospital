from flask import Flask, request, jsonify
from pymongo import MongoClient
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings
from langchain.chains import ConversationalRetrievalChain
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
import os
from flask_cors import CORS
from bson import ObjectId

# Load environment variables from the .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB configuration
client = MongoClient(os.getenv("MONGO_URI"))
db = client['test']  # Replace 'test' with your database name if different
collection_medecins = db['doctors']

# Initialize OpenAI model with API key
llm = ChatOpenAI(openai_api_key=os.getenv("OPENAI_API_KEY"))
memory = ConversationBufferMemory(memory_key='chat_history', return_messages=True)

# Initialize OpenAI embeddings
embeddings = OpenAIEmbeddings()

# Path to save the FAISS index
faiss_index_path = "faiss_index"

# Function to process PDF files and create a vector store
def process_pdfs_and_create_vectorstore(pdf_directory):
    texts = []
    metadatas = []

    for file_name in os.listdir(pdf_directory):
        if file_name.endswith('.pdf'):
            file_path = os.path.join(pdf_directory, file_name)
            print(f"Processing PDF: {file_path}")  # Print to verify PDF files
            pdf_text = get_pdf_text(file_path)
            text_chunks = get_text_chunks(pdf_text)
            texts.extend(text_chunks)
            metadatas.extend([{"source": file_name}] * len(text_chunks))

    vectorstore = FAISS.from_texts(texts, embeddings, metadatas)
    vectorstore.save_local(faiss_index_path)
    return vectorstore

# Function to get text from a PDF file
def get_pdf_text(pdf_path):
    text = ""
    with open(pdf_path, "rb") as file:
        reader = PdfReader(file)
        for page in reader.pages:
            text += page.extract_text()
    return text

# Function to split text into smaller chunks
def get_text_chunks(text):
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    chunks = text_splitter.split_text(text)
    return chunks

# Check if the FAISS index already exists, otherwise create it
if not os.path.exists(faiss_index_path):
    pdf_directory = "Chat_PDF/pdf"  # Use the path to your PDF files
    vectorstore = process_pdfs_and_create_vectorstore(pdf_directory)
else:
    vectorstore = FAISS.load_local(faiss_index_path, embeddings)

def get_conversation_chain():
    conversation_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vectorstore.as_retriever(),
        memory=memory
    )
    return conversation_chain

conversation_chain = get_conversation_chain()

@app.route('/diagnostic', methods=['POST'])
def diagnostic():
    data = request.json
    question = data.get('question')

    # First try to answer the question based on the PDF content
    response = conversation_chain({'question': question})
    last_message = response['chat_history'][-1].content

    # Check if the AI response indicates it couldn't find an answer
    if not any(keyword in last_message.lower() for keyword in ["cancer", "glaucome", "Cardiologie".lower()]):
        # If not, return a response indicating that no relevant information was found
        last_message = "Aucune information pertinente n'a été trouvée dans les PDF fournis. Veuillez consulter un professionnel de la santé pour un diagnostic médical approprié."

    # Logic to detect multiple diagnostics
    diagnostics = []
    if "cancer" in question.lower():
        diagnostics.append("cancer")
    if "glaucome" in question.lower():
        diagnostics.append("glaucome")

    # Only add diagnostics if there are specific terms found
    diagnostic_str = ", ".join(diagnostics) if diagnostics else "Aucun diagnostic préliminaire"

    # Find specialists in MongoDB
    specialistes = []
    if diagnostics:  # Only search for specialists if there are diagnostics
        for diag in diagnostics:
            medecins = list(collection_medecins.find({"specialization": diag}))
            # Convert ObjectId to string for each doctor
            for medecin in medecins:
                medecin['_id'] = str(medecin['_id'])
                # Convert ObjectId in reviews if present
                if 'reviews' in medecin:
                    medecin['reviews'] = [str(review_id) for review_id in medecin['reviews']]
            specialistes.extend(medecins)

    # Prepare the response data
    response_data = {
        'diagnostic': diagnostic_str,
        'response': last_message,
        'specialistes': specialistes
    }

    # Debugging: print the response data to verify
    print(response_data)

    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True, port=5005)
