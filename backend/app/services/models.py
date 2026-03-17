from typing import Any
from pydantic import BaseModel, Field

from backend.app.core.state import ConversationState


class ChatMessage(BaseModel):
    role: str
    text: str


class SessionContext(BaseModel):
    session_id: str
    state: ConversationState = ConversationState.DISCOVERY
    user_idea: str | None = None
    niche: str | None = None
    monetization_preferences: list[str] = Field(default_factory=list)
    readiness_score: int | None = None
    history: list[ChatMessage] = Field(default_factory=list)
    meta: dict[str, Any] = Field(default_factory=dict)


class StartSessionResponse(BaseModel):
    session_id: str
    message: str
    state: ConversationState


class UserMessageRequest(BaseModel):
    session_id: str
    text: str


class AssistantResponse(BaseModel):
    session_id: str
    state: ConversationState
    reply: str
    suggestions: list[str] = Field(default_factory=list)
    context: dict[str, Any] = Field(default_factory=dict)
