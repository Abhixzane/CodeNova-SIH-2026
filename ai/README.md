# BharatYatra - AI & Intelligent Travel Agent Subsystem

This directory houses the AI models, prompt templates, autonomous tool definitions, conversational memory, and LLM orchestration services powering the BharatYatra platform for Smart India Hackathon (SIH) 2026.

## Architecture

```
ai/
├── services/          # Gemini API integrations, conversational agents, itinerary generation
├── prompts/           # Curated prompt engineering templates for Indian tourism & heritage
├── tools/             # Function-calling tool definitions (place search, routing, fare estimation)
├── models/            # Pydantic data contracts for LLM inputs and outputs
├── memory/            # Conversation context buffer and session state
└── README.md
```

## Features

- **Heritage Cultural Curation**: Contextual historical backgrounds, architectural nuances, and local etiquette.
- **Multimodal Routing Function Calling**: Autonomous invocation of railway timetables, metro routes, and meter fare estimators.
- **Time & Budget Optimizer**: Generates realistic day itineraries accounting for transit friction, peak heat hours, and entry timings.
- **Local Language Support**: Seamless multilingual assistance across Hindi, Marathi, Bengali, Tamil, Telugu, and English.
