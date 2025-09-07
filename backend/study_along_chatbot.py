from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict

# --- Core LangChain Imports ---
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.docstore.document import Document
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

# --- 1. The "Vibe" Database ---
# This is our knowledge base of predefined study profiles.
STUDY_VIBES_DATABASE = [
    {
        "vibe_tag": "lofi_pomodoro_night",
        "parameters": {"sound": "lofi", "rhythm": "pomodoro", "time": "night"},
        "description": "A focused night owl who enjoys lo-fi beats and works in structured Pomodoro sprints."
    },
    {
        "vibe_tag": "classical_marathon_morning",
        "parameters": {"sound": "classical", "rhythm": "marathon", "time": "morning"},
        "description": "An early bird who achieves deep focus in long, uninterrupted sessions with classical music."
    },
    {
        "vibe_tag": "ambient_casual_afternoon",
        "parameters": {"sound": "ambient", "rhythm": "casual", "time": "afternoon"},
        "description": "A relaxed learner who studies at a flexible pace in the afternoon with soothing ambient sounds."
    },
    {
        "vibe_tag": "silence_marathon_night",
        "parameters": {"sound": "silence", "rhythm": "marathon", "time": "night"},
        "description": "A late-night studier who prefers absolute silence for long, deep work sessions."
    }
    # You can add as many vibe combinations as you want here
]

# --- 2. Pydantic Models ---
class VibeRequest(BaseModel):
    user_id: str
    description: str # e.g., "I like to study late at night with some chill music and take breaks"

class UserProfileResponse(BaseModel):
    user_id: str
    vibe_tag: str
    parameters: Dict[str, str]
    description: str

# --- 3. Simplified Retriever Setup (Runs Once on Startup) ---
def initialize_vibe_retriever():
    """
    Creates the core components of our vibe matching system once.
    """
    try:
        # Convert vibe data into LangChain Document objects
        documents = []
        for vibe in STUDY_VIBES_DATABASE:
            # The page_content is what the search runs on. The metadata holds the result.
            doc = Document(page_content=vibe["description"], metadata=vibe)
            documents.append(doc)
        
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        vector_store = FAISS.from_documents(documents, embeddings)
        # We only need the single best match, so k=1
        return vector_store.as_retriever(search_kwargs={"k": 1})

    except Exception as e:
        # Print full traceback to help debugging in logs
        import traceback
        traceback.print_exc()
        print(f"WARNING: Could not initialize the vector retriever; falling back to a simple keyword retriever: {e}")

        # Simple fallback retriever: choose best profile by keyword overlap
        class SimpleRetriever:
            def __init__(self, db):
                self.db = db

            def get_relevant_documents(self, query: str):
                q = (query or "").lower()
                best = None
                best_score = -1
                for vibe in self.db:
                    score = 0
                    # parameter keywords match (higher weight)
                    for v in vibe.get('parameters', {}).values():
                        if v and v.lower() in q:
                            score += 3
                    # description keyword overlap
                    for token in vibe.get('description', '').split():
                        t = token.lower().strip('.,')
                        if t and t in q:
                            score += 1
                    if score > best_score:
                        best_score = score
                        best = vibe

                # If nothing matched, return the first profile as a safe default
                if best is None:
                    best = self.db[0]

                return [Document(page_content=best['description'], metadata=best)]

        return SimpleRetriever(STUDY_VIBES_DATABASE)

# --- 4. FastAPI App ---
app = FastAPI(title="Simplified Study Vibe Profiler")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

vibe_retriever = initialize_vibe_retriever()

@app.post("/get-study-vibe-profile", response_model=UserProfileResponse)
def get_vibe_profile_endpoint(request: VibeRequest):
    """
    Receives a user's natural language description of their study habits
    and returns the best matching structured profile.
    """
    if not vibe_retriever:
        raise HTTPException(status_code=503, detail="Study vibe profiling service is currently unavailable.")

    # 1. Use the retriever to find the single best matching vibe document
    retrieved_docs = vibe_retriever.get_relevant_documents(request.description)
    
    if not retrieved_docs:
        raise HTTPException(status_code=444, detail="Could not determine a study vibe from your description. Please try rephrasing.")

    # 2. Extract the structured profile data from the document's metadata
    best_match_profile = retrieved_docs[0].metadata
    
    # 3. Add the user's ID to the final response
    response_data = {
        "user_id": request.user_id,
        "vibe_tag": best_match_profile["vibe_tag"],
        "parameters": best_match_profile["parameters"],
        "description": best_match_profile["description"]
    }
    
    return UserProfileResponse(**response_data)