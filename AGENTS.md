# AI-Blog-Advisor Agent Guide

## Project Purpose
AI-Blog-Advisor is a production-oriented starter for an Arabic conversational advisor that helps users turn unclear blog ideas into profitable, actionable content business plans.

## Repository Structure
- `backend/`: FastAPI service, decision engine, prompts, and APIs.
- `frontend/`: Lightweight web chat client (Arabic UX) consuming backend APIs.
- `docs/`: Product and architecture specifications.
- `ai-memory/`: Fast project memory for AI agents (overview, architecture, workflow, status).

## Architecture Summary
- **Frontend**: Single-page chat UX in Arabic.
- **Backend**: FastAPI with modular services.
- **AI Layer**:
  - System prompt (global behavior)
  - Task prompts (analysis, generation, refinement, monetization, evaluation, weak-idea handling, soft conversion)
  - State machine + decision engine
  - Context store per conversation session

## Development Workflow
1. Update `ai-memory/` first when architecture/workflow changes.
2. Implement changes incrementally (small, isolated edits).
3. Keep prompts in English; keep user-facing text in Arabic.
4. Run checks before commit:
   - `python -m compileall backend`
   - `python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000` (smoke run)
5. Document API or flow changes in `docs/`.

## Important Rules
- Preserve modular boundaries (`api`, `services`, `prompts`, `core`).
- Do not hardcode single monetization model.
- Keep advisory tone conversational and non-pushy.
- Ensure all user-visible responses are Arabic.

## Integration Points
- `POST /api/v1/chat/start`: Initialize session and onboarding.
- `POST /api/v1/chat/message`: Process message using decision engine.
- `GET /api/v1/chat/session/{session_id}`: Retrieve state/context snapshot.

## Extensibility Notes
- Add LLM provider adapters under `backend/app/services/`.
- Add analytics/tool integrations via new service modules and API routes.
- Extend business domains by adding new prompt packs and flow states.
