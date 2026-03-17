from uuid import uuid4

from backend.app.services.models import SessionContext


class InMemorySessionStore:
    def __init__(self) -> None:
        self._sessions: dict[str, SessionContext] = {}

    def create(self) -> SessionContext:
        session_id = str(uuid4())
        session = SessionContext(session_id=session_id)
        self._sessions[session_id] = session
        return session

    def get(self, session_id: str) -> SessionContext:
        session = self._sessions.get(session_id)
        if not session:
            raise KeyError("Session not found")
        return session

    def save(self, session: SessionContext) -> SessionContext:
        self._sessions[session.session_id] = session
        return session
