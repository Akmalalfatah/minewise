"""
AI Module for MineWise ML System
================================
This module handles LLM integration for:
- Chatbox conversational AI
- AI-powered scenario generation
- Context building from operational data
"""

# Import context builder (always available)
from .context_builder import (
    LLMContextBuilder,
    get_chatbox_context,
    get_scenario_context,
    SAFETY_THRESHOLDS,
    OPERATIONAL_CONSTRAINTS,
    COST_PARAMETERS,
    KNOWLEDGE_BASE,
    BEST_PRACTICES
)

# Try to import LLM handler (requires langchain)
try:
    from .llm_handler_example import (
        MineWiseLLM,
        ContextBuilder,
        PromptTemplates,
        LLMConfig
    )
    LLM_AVAILABLE = True
except ImportError:
    LLM_AVAILABLE = False
    MineWiseLLM = None
    ContextBuilder = None
    PromptTemplates = None
    LLMConfig = None

__all__ = [
    # Context Builder (always available)
    'LLMContextBuilder',
    'get_chatbox_context',
    'get_scenario_context',
    'SAFETY_THRESHOLDS',
    'OPERATIONAL_CONSTRAINTS',
    'COST_PARAMETERS',
    'KNOWLEDGE_BASE',
    'BEST_PRACTICES',
    # LLM Handler (optional, requires langchain)
    'MineWiseLLM',
    'ContextBuilder',
    'PromptTemplates',
    'LLMConfig'
]
