from backend.app.prompts.modules import TASK_PROMPTS
from backend.app.prompts.system import SYSTEM_PROMPT
from backend.app.services.decision_engine import DecisionEngine
from backend.app.services.models import AssistantResponse, SessionContext, StartSessionResponse
from backend.app.services.session_store import InMemorySessionStore


class AdvisorService:
    def __init__(self, store: InMemorySessionStore, engine: DecisionEngine) -> None:
        self.store = store
        self.engine = engine

    def start_session(self) -> StartSessionResponse:
        session = self.store.create()
        message = (
            "أهلًا بك في AI Blog Advisor ✨\n"
            "أنا هنا لمساعدتك في تحويل أي فكرة (حتى لو كانت غير واضحة) إلى مشروع محتوى مربح بخطوات عملية.\n"
            "هل لديك فكرة حالياً أم نبتكرها معاً؟"
        )
        self.engine.append_history(session, "assistant", message)
        self.store.save(session)
        return StartSessionResponse(session_id=session.session_id, message=message, state=session.state)

    def process_message(self, session_id: str, text: str) -> AssistantResponse:
        session = self.store.get(session_id)
        self.engine.append_history(session, "user", text)

        next_state, reply, suggestions = self.engine.route(session, text)
        self.engine.append_history(session, "assistant", reply)
        self.store.save(session)

        context_payload = {
            "system_prompt": SYSTEM_PROMPT,
            "active_modules": self._active_modules(next_state),
            "user_idea": session.user_idea,
            "niche": session.niche,
            "readiness_score": session.readiness_score,
        }

        return AssistantResponse(
            session_id=session.session_id,
            state=next_state,
            reply=reply,
            suggestions=suggestions,
            context=context_payload,
        )

    def get_session(self, session_id: str) -> SessionContext:
        return self.store.get(session_id)

    def _active_modules(self, state: str) -> list[str]:
        mapper = {
            "discovery": ["explanation"],
            "idea_generation": ["idea_generation"],
            "idea_analysis": ["idea_analysis", "weak_idea_handling"],
            "niche_refinement": ["refinement"],
            "monetization_strategy": ["monetization_strategy", "explanation"],
            "content_planning": ["explanation"],
            "readiness_evaluation": ["evaluation"],
            "soft_conversion": ["soft_conversion"],
        }
        return [TASK_PROMPTS[key] for key in mapper.get(state, ["explanation"])]
