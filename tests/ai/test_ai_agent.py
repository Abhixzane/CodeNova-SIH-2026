"""
AI Subsystem and Tool Declaration Unit Tests.
"""
import sys
import os

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.insert(0, os.path.join(ROOT_DIR, "ai"))

from prompts.system_prompts import BHARATYATRA_SYSTEM_PROMPT
from memory.conversation_store import conversation_memory
from tools.place_search_tool import PLACE_SEARCH_TOOL_DECLARATION
from tools.fare_calculator_tool import FARE_CALCULATOR_TOOL_DECLARATION


def test_system_prompt_structure():
    assert "BharatYatra AI" in BHARATYATRA_SYSTEM_PROMPT
    assert "Archaeological Survey of India" in BHARATYATRA_SYSTEM_PROMPT


def test_tool_declarations():
    assert PLACE_SEARCH_TOOL_DECLARATION["name"] == "search_places"
    assert FARE_CALCULATOR_TOOL_DECLARATION["name"] == "estimate_travel_fare"
    assert "parameters" in PLACE_SEARCH_TOOL_DECLARATION


def test_conversation_memory():
    conv_id = "test-session-101"
    conversation_memory.add_message(conv_id, "user", "Hello!")
    conversation_memory.add_message(conv_id, "assistant", "Namaste!")
    history = conversation_memory.get_history(conv_id)
    assert len(history) == 2
    assert history[0]["role"] == "user"
    assert history[1]["role"] == "assistant"
