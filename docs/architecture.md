# AI Blog Advisor Architecture

## 1) Full System Architecture

### Frontend
- Single-page chat client (`frontend/`)
- Arabic-first UX and quick suggestion chips
- Calls backend REST endpoints

### Backend
- FastAPI app (`backend/app/main.py`)
- API routes for session lifecycle and chat
- CORS enabled and static frontend hosting

### AI Layer (Modular)
1. **System Prompt**: behavioral guardrails
2. **Task Prompt Library**: role-specific prompt modules
3. **Context Manager**: session state/history persistence
4. **Decision Engine**: deterministic state routing
5. **Advisor Service**: orchestration between API, prompts, and flow

## 2) Conversation Flow Logic (State Machine)

`DISCOVERY -> IDEA_GENERATION -> IDEA_ANALYSIS -> NICHE_REFINEMENT -> MONETIZATION_STRATEGY -> CONTENT_PLANNING -> READINESS_EVALUATION -> SOFT_CONVERSION`

### Routing Rules
- If user has idea in discovery -> move to analysis.
- If user has no idea -> generate ideas first.
- Analysis always followed by niche refinement.
- Refinement followed by monetization comparison.
- Monetization followed by content planning.
- Planning followed by readiness scoring.
- Soft conversion is optional and non-pushy.

## 3) Scalability Considerations
- Replace in-memory store with Redis/Postgres for persistence.
- Add async job queue for heavy analysis tasks.
- Add LLM provider adapters for OpenAI/Anthropic/local models.
- Add observability: structured logs, traces, token usage, SLA metrics.
- Deploy via container orchestration with horizontal scaling.

## 4) Future Extensibility
- Add domain packs (YouTube advisor, newsletter advisor, ecommerce advisor)
- Add analytics integrations (GA4, Search Console, ad RPM APIs)
- Add monetization simulator and forecasting modules
