# AI Blog Advisor - Project Guide

## Overview
This project is an AI-powered advisor designed to help Arabic-speaking users conceptualize, refine, and plan successful blogs for monetization (AdSense). It uses a dynamic conversational flow to guide users through various stages of blog development.

## Architecture
- **Frontend**: React (Vite) with Tailwind CSS.
- **AI Engine**: Google Gemini API via `@google/genai`.
- **Styling**: Modern, clean UI with RTL support for Arabic.
- **State Management**: React hooks for conversation history and AI state.

## Core Logic
The application follows a set of predefined prompts:
1. **System Prompt**: Defines the persona and core behavior.
2. **Conversation Starter**: Initiates the chat.
3. **Idea Analysis**: Evaluates user ideas for profitability and competition.
4. **Niche Refinement**: Helps narrow down broad ideas.
5. **Idea Generation**: Provides suggestions if the user has no idea.
6. **Content Plan**: Generates a starter SEO-friendly content plan.
7. **Readiness Evaluation**: Scores the user's progress.
8. **Soft Conversion**: Suggests professional building services.
9. **Explanation**: Simplifies complex concepts like SEO/AdSense.
10. **Weak Idea Handling**: Constructively improves weak ideas.

## Development Workflow
- **Prompts**: Located in `src/services/prompts.ts`.
- **AI Service**: `src/services/gemini.ts` handles API calls.
- **Components**: Modular React components in `src/components/`.

## Important Rules
- All user-facing text MUST be in Arabic.
- The tone must be friendly, expert, and encouraging.
- The UI must support Right-to-Left (RTL) layout.
