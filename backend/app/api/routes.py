from fastapi import APIRouter, HTTPException

from backend.app.services.advisor_service import AdvisorService
from backend.app.services.decision_engine import DecisionEngine
from backend.app.services.models import AssistantResponse, StartSessionResponse, UserMessageRequest
from backend.app.services.session_store import InMemorySessionStore

router = APIRouter(prefix="/api/v1/chat", tags=["chat"])
service = AdvisorService(store=InMemorySessionStore(), engine=DecisionEngine())


@router.post("/start", response_model=StartSessionResponse)
def start_chat() -> StartSessionResponse:
    return service.start_session()


@router.post("/message", response_model=AssistantResponse)
def send_message(payload: UserMessageRequest) -> AssistantResponse:
    try:
        return service.process_message(payload.session_id, payload.text)
    except KeyError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.get("/session/{session_id}")
def get_session(session_id: str) -> dict:
    try:
        session = service.get_session(session_id)
    except KeyError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    return session.model_dump()
