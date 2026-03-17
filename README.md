# AI Blog Advisor

Production-grade starter for an Arabic AI advisory assistant that helps users build profitable blog/content businesses.

## Quick Start
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```

Open `http://localhost:8000`.

## Key Features
- Arabic conversational UX
- Multi-model monetization support (ads, affiliate, products, services, sponsorships, email)
- Modular prompts
- Conversation state machine
- Session context API

See `docs/` for architecture and flow.
