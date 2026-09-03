"""
Conversational Session Memory Store for BharatYatra AI Guide.
"""
from typing import Dict, List, Any
from datetime import datetime


class ConversationMemoryStore:
    def __init__(self, max_history_turns: int = 10):
        self._store: Dict[str, List[Dict[str, Any]]] = {}
        self._max_history = max_history_turns

    def get_history(self, conversation_id: str) -> List[Dict[str, Any]]:
        return self._store.get(conversation_id, [])

    def add_message(self, conversation_id: str, role: str, content: str):
        if conversation_id not in self._store:
            self._store[conversation_id] = []
        self._store[conversation_id].append({
            "role": role,
            "content": content,
            "timestamp": datetime.utcnow().isoformat(),
        })
        # Keep within sliding window
        if len(self._store[conversation_id]) > self._max_history * 2:
            self._store[conversation_id] = self._store[conversation_id][-self._max_history * 2:]

    def clear(self, conversation_id: str):
        if conversation_id in self._store:
            del self._store[conversation_id]


conversation_memory = ConversationMemoryStore()
