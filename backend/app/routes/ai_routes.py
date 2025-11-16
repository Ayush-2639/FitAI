from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ai_service import generate_ai_response

router = APIRouter(prefix="/ai", tags=["AI"])

class AIRequest(BaseModel):
    query: str

@router.post("/chat")
async def chat_with_ai(request: AIRequest):
    response = generate_ai_response(request.query)
    return {"response": response}
