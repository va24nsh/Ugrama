from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Any
from dotenv import load_dotenv
import numpy as np
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.docstore.document import Document
from langchain.schema import BaseRetriever

# --- Database Import ---
from course_database import COURSE_DATABASE

# --- TF-IDF Fallback Imports ---
try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import linear_kernel
except ImportError:
    TfidfVectorizer = None
    linear_kernel = None

load_dotenv()

# --- Pydantic Models ---
class RAGRequest(BaseModel):
    query: str
    level: Optional[str] = None

class Course(BaseModel):
    id: str
    title: str
    description: str
    price: float
    duration: int
    level: str
    thumbnail: str
    category: str
    educatorId: str
    published: bool

class RAGResponse(BaseModel):
    courses: List[Course]
    warning: Optional[str] = None

# --- Corrected TF-IDF Retriever Fallback ---
class SimpleTfidfRetriever(BaseRetriever):
    docs: List[Document]
    k: int
    corpus: List[str]
    vectorizer: Any
    doc_vectors: Any

    class Config:
        arbitrary_types_allowed = True

    def __init__(self, documents: List[Document], k: int = 3, **kwargs):
        if TfidfVectorizer is None or linear_kernel is None:
            raise RuntimeError("scikit-learn is required for TF-IDF fallback. Install it with: pip install scikit-learn")
        
        corpus = [d.page_content for d in documents]
        vectorizer = TfidfVectorizer(stop_words="english").fit(corpus)
        doc_vectors = vectorizer.transform(corpus)
        
        super().__init__(
            docs=documents, 
            k=k, 
            corpus=corpus, 
            vectorizer=vectorizer, 
            doc_vectors=doc_vectors, 
            **kwargs
        )

    def _get_relevant_documents(self, query: str, **kwargs) -> List[Document]:
        if not self.docs or linear_kernel is None:
            return []
        try:
            query_vector = self.vectorizer.transform([query])
            similarities = linear_kernel(query_vector, self.doc_vectors).flatten()
            top_indices = np.argsort(similarities)[::-1][:self.k]
            return [self.docs[i] for i in top_indices if similarities[i] > 0]
        except Exception:
            return []

    async def _aget_relevant_documents(self, query: str, **kwargs) -> List[Document]:
        return self._get_relevant_documents(query, **kwargs)

# --- FastAPI App ---
app = FastAPI(title="Filtered Course Recommender")
_rag_pipeline = None

def get_rag_pipeline():
    global _rag_pipeline
    if _rag_pipeline is not None:
        return _rag_pipeline

    documents = []
    for course in COURSE_DATABASE:
        content = (
            f"Title: {course['title']}. Description: {course['description']}. "
            f"Level: {course['level']}. Category: {course['category']}."
        )
        documents.append(Document(page_content=content, metadata=course))

    try:
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        vector_store = FAISS.from_documents(documents, embeddings)
        retriever = vector_store.as_retriever(search_kwargs={"k": 3})
    except Exception as e:
        print(f"Embeddings/FAISS failed ({e}). Using TF-IDF fallback retriever.")
        retriever = SimpleTfidfRetriever(documents, k=3)

    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash-latest")
    _rag_pipeline = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True
    )
    return _rag_pipeline

@app.post("/courserecommendations", response_model=RAGResponse)
def get_recommendations_endpoint(request: RAGRequest):
    try:
        rag_pipeline = get_rag_pipeline()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RAG initialization failed: {e}")

    result = rag_pipeline.invoke({"query": request.query})
    
    if not result.get("source_documents"):
        raise HTTPException(status_code=404, detail="No courses found for your query.")

    retrieved_courses = [doc.metadata for doc in result["source_documents"]]
    final_courses = retrieved_courses
    warning_message = None
    
    if request.level:
        filtered_courses = [
            course for course in retrieved_courses 
            if str(course.get('level', '')).lower() == request.level.lower()
        ]
        
        if filtered_courses:
            final_courses = filtered_courses
        else:
            warning_message = f"We couldn't find any courses matching the level '{request.level}'. Showing the most relevant results instead."

    courses_to_return = [Course(**course_data) for course_data in final_courses[:3]]
    
    return RAGResponse(courses=courses_to_return, warning=warning_message)