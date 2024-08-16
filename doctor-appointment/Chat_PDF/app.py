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

def get_pdf_text_from_files(file_paths):
    """Extraire le texte de plusieurs fichiers PDF."""
    text = ""
    for file_path in file_paths:
        with open(file_path, "rb") as pdf_file:
            pdf_reader = PdfReader(pdf_file)
            for page in pdf_reader.pages:
                text += page.extract_text()
    return text

def get_text_chunks(text):
    """Diviser le texte en segments plus petits."""
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    chunks = text_splitter.split_text(text)
    return chunks

def get_vectorstore(text_chunks):
    """Créer une base de données vectorielle à partir des segments de texte."""
    embeddings = OpenAIEmbeddings()
    vectorstore = FAISS.from_texts(texts=text_chunks, embedding=embeddings)
    return vectorstore

def get_conversation_chain(vectorstore):
    """Créer la chaîne de conversation en utilisant la base de données vectorielle."""
    llm = ChatOpenAI()
    memory = ConversationBufferMemory(memory_key='chat_history', return_messages=True)
    conversation_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vectorstore.as_retriever(),
        memory=memory,
    )
    return conversation_chain

def process_files_and_setup():
    """Fonction pour traiter automatiquement les fichiers PDF et configurer la conversation."""
    pdf_directory = "C:/Users/user/Desktop/Chat_PDF/Chat_PDF"  # Remplacez par votre chemin réel

    # Obtenir tous les fichiers PDF dans le répertoire
    preloaded_pdf_paths = [os.path.join(pdf_directory, f) for f in os.listdir(pdf_directory) if f.endswith('.pdf')]

    if not preloaded_pdf_paths:
        st.error("Aucun fichier PDF trouvé dans le répertoire spécifié.")
        return False
    else:
        raw_text = get_pdf_text_from_files(preloaded_pdf_paths)

        # Obtenir les segments de texte
        text_chunks = get_text_chunks(raw_text)
        st.session_state.text_chunks = text_chunks  # Stocker les segments de texte dans l'état de session

        # Créer une base de données vectorielle et la stocker dans l'état de session
        st.session_state.vectorstore = get_vectorstore(text_chunks)

        # Créer une chaîne de conversation
        st.session_state.conversation = get_conversation_chain(st.session_state.vectorstore)
        return True

def handle_userinput(user_question):
    if st.session_state.conversation is None:
        st.error("Erreur lors du traitement des documents.")
        return

    # Vérifier si la question est liée au contenu des PDF
    relevant_documents = st.session_state.vectorstore.similarity_search(user_question, k=1)
    
    if relevant_documents and len(relevant_documents) > 0:
        # Générer et afficher la réponse uniquement si la question est pertinente
        response = st.session_state.conversation({'question': user_question})
        if response and response['chat_history']:
            last_message = response['chat_history'][-1].content
            st.write(last_message)
    else:
        # Si aucune correspondance pertinente n'est trouvée, afficher un message spécifique
        st.write("Je n'ai pas de réponse pour cette question.")

def main():
    load_dotenv()
    st.set_page_config(page_title="Chat avec vos PDF", page_icon="📄")

    if "conversation" not in st.session_state:
        st.session_state.conversation = None
    if "text_chunks" not in st.session_state:
        st.session_state.text_chunks = None

    # Traiter automatiquement les fichiers PDF dès le lancement
    if process_files_and_setup():
        st.header("Chat basé sur vos documents PDF")

        # Champ de saisie pour la question de l'utilisateur
        user_question = st.text_input("Posez une question concernant vos documents:")

        if user_question:
            handle_userinput(user_question)
    else:
        st.error("Le traitement des fichiers PDF a échoué.")

if __name__ == '__main__':
    main()
