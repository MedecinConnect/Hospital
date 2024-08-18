import streamlit as st
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
import os

def apply_custom_css():
    st.markdown("""
    <style>
    body {
        font-family: Arial, sans-serif;
    }
    
    .stButton button {
        background-color: #0d6efd;
        color: white;
        border-radius: 12px;
        padding: 8px 16px;
        border: none;
    }
    
    .stTextInput input {
        padding: 10px;
        border: 1px solid #ced4da;
        border-radius: 8px;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    }
    
    .stTextInput input:focus {
        border-color: #80bdff;
        outline: 0;
        box-shadow: 0 0 8px rgba(128, 189, 255, 0.6);
    }
    
    .stHeader h1 {
        color: #0d6efd;
        font-size: 24px;
        text-align: center;
        margin-bottom: 20px;
    }
    
    .stAlert {
        padding: 12px;
        background-color: #f8d7da;
        color: #721c24;
        border-radius: 8px;
    }
    
    .stWrite {
        padding: 10px;
        background-color: #f8f9fa;
        border-radius: 8px;
        margin-bottom: 10px;
    }
    
    iframe {
        border-radius: 12px;
        border: 2px solid #dee2e6;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
    }
    </style>
    """, unsafe_allow_html=True)

def get_pdf_text_from_files(file_paths):
    """Extract text from multiple PDF files."""
    text = ""
    for file_path in file_paths:
        with open(file_path, "rb") as pdf_file:
            pdf_reader = PdfReader(pdf_file)
            for page in pdf_reader.pages:
                text += page.extract_text()
    return text

def get_text_chunks(text):
    """Split text into smaller chunks."""
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    chunks = text_splitter.split_text(text)
    return chunks

def get_vectorstore(text_chunks):
    """Create a vector store from text chunks."""
    embeddings = OpenAIEmbeddings()
    vectorstore = FAISS.from_texts(texts=text_chunks, embedding=embeddings)
    return vectorstore

def get_conversation_chain(vectorstore):
    """Create the conversation chain using the vector store."""
    llm = ChatOpenAI()
    memory = ConversationBufferMemory(memory_key='chat_history', return_messages=True)
    conversation_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vectorstore.as_retriever(),
        memory=memory
    )
    return conversation_chain

def process_files_and_setup():
    """Automatically process PDF files and set up the conversation."""
    pdf_directory = "C:/Users/user/Desktop/Chat_PDF/Chat_PDF"  # Replace with your actual path

    preloaded_pdf_paths = [os.path.join(pdf_directory, f) for f in os.listdir(pdf_directory) if f.endswith('.pdf')]

    if not preloaded_pdf_paths:
        st.error("No PDF files found in the specified directory.")
        return False
    else:
        raw_text = get_pdf_text_from_files(preloaded_pdf_paths)

        text_chunks = get_text_chunks(raw_text)
        st.session_state.text_chunks = text_chunks  # Store text chunks in session state

        st.session_state.vectorstore = get_vectorstore(text_chunks)

        st.session_state.conversation = get_conversation_chain(st.session_state.vectorstore)
        return True

def handle_userinput(user_question):
    if st.session_state.conversation is None:
        st.error("Error processing the documents.")
        return

    # Add context to the question
    contextual_question = f"As a doctor, answer this question based on the documents: {user_question}"

    relevant_documents = st.session_state.vectorstore.similarity_search(contextual_question, k=1)
    
    if relevant_documents and len(relevant_documents) > 0:
        response = st.session_state.conversation({'question': contextual_question})
        if response and response['chat_history']:
            last_message = response['chat_history'][-1].content
            st.write(last_message)
    else:
        st.write("Je n'ai pas de réponse pour cette question.")

def main():
    load_dotenv()
    st.set_page_config(page_title="Chat avec vos PDF", page_icon="📄")

    apply_custom_css()

    if "conversation" not in st.session_state:
        st.session_state.conversation = None
    if "text_chunks" not in st.session_state:
        st.session_state.text_chunks = None

    if process_files_and_setup():
        st.header("Chat basé sur vos documents PDF")

        user_question = st.text_input("Posez une question concernant vos documents:")

        if user_question:
            handle_userinput(user_question)
    else:
        st.error("Le traitement des fichiers PDF a échoué.")

if __name__ == '__main__':
    main()
