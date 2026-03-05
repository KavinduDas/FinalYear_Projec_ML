# import os
# from dotenv import load_dotenv
# from llama_index.llms.groq import Groq
# from llama_index.embeddings.huggingface import HuggingFaceEmbedding
# from llama_index.core import Settings, SimpleDirectoryReader, VectorStoreIndex

# load_dotenv()

# MODEL_NAME = "meta-llama/llama-4-scout-17b-16e-instruct"
# API_KEY = os.getenv("GROQ_API_KEY")
# EMBEDDING_MODEL = "sentence-transformers/all-mpnet-base-v2"

# def create_query_engine():
#     docs = SimpleDirectoryReader("./data").load_data()

#     Settings.llm = Groq(model=MODEL_NAME, api_key=API_KEY)
#     Settings.embed_model = HuggingFaceEmbedding(model_name=EMBEDDING_MODEL)

#     index = VectorStoreIndex.from_documents(docs)

#     return index.as_query_engine(similarity_top_k=3)

# query_engine = create_query_engine()

# rag.py
# rag.py
from llama_index.llms.groq import Groq
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core import Settings, SimpleDirectoryReader, VectorStoreIndex
import os
from dotenv import load_dotenv

load_dotenv()
MODEL_NAME = "meta-llama/llama-4-scout-17b-16e-instruct"
API_KEY = os.getenv("GROQ_API_KEY")
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

query_engine = None  

def get_query_engine():
    global query_engine
    if query_engine is None:
        print("Loading query engine...")

        docs = SimpleDirectoryReader("./data").load_data()

        Settings.llm = Groq(model=MODEL_NAME, api_key=API_KEY)

        Settings.embed_model = HuggingFaceEmbedding(model_name=EMBEDDING_MODEL)

        index = VectorStoreIndex.from_documents(docs)

        query_engine = index.as_query_engine(similarity_top_k=3)
    return query_engine