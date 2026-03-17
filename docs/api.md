# API Design

## POST /api/v1/chat/start
Starts a conversation.

**Response**
```json
{
  "session_id": "uuid",
  "message": "arabic onboarding",
  "state": "discovery"
}
```

## POST /api/v1/chat/message
Processes a user message.

**Request**
```json
{
  "session_id": "uuid",
  "text": "user input"
}
```

**Response**
```json
{
  "session_id": "uuid",
  "state": "idea_analysis",
  "reply": "arabic advisor response",
  "suggestions": ["..."],
  "context": {
    "system_prompt": "...",
    "active_modules": ["..."],
    "user_idea": "...",
    "niche": "...",
    "readiness_score": null
  }
}
```

## GET /api/v1/chat/session/{session_id}
Returns full session context and history.
