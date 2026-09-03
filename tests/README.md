# BharatYatra Automated Test Suites

Comprehensive testing infrastructure covering backend APIs, AI tool execution, end-to-end integration flows, and frontend business logic.

## Test Directory Structure

```
tests/
├── backend/          # Pytest suites for FastAPI endpoints and validation
├── ai/               # Unit tests for prompt construction, memory buffer, tool schemas
├── integration/      # End-to-end multimodal route, transit, and day circuit tests
├── frontend/         # TypeScript test suites for fare logic and geospatial calculations
└── README.md
```

## Running Tests

### Backend, AI & Integration Tests
```bash
pytest tests/backend tests/ai tests/integration -v
```

### Frontend Tests
```bash
npm run lint
```
