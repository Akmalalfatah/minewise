"""
CONTOH IMPLEMENTASI LLM - MINEWISE ML SYSTEM
============================================
File ini berisi contoh lengkap implementasi LLM menggunakan LangChain + OpenAI GPT-4
untuk Chatbox dan AI Recommendation scenarios.
"""

import os
from typing import Dict, Any, List
from datetime import datetime
import json

from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferMemory

# ============================================================================
# CONFIGURATION
# ============================================================================

class LLMConfig:
    """LLM Configuration"""
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your-api-key-here")
    MODEL_NAME = "gpt-4-turbo-preview"
    TEMPERATURE = 0.3  # Lower = more deterministic
    MAX_TOKENS = 1000
    
    # For chatbox (conversational)
    CHATBOX_TEMPERATURE = 0.3
    CHATBOX_MAX_TOKENS = 500
    
    # For scenarios (more creative)
    SCENARIO_TEMPERATURE = 0.5
    SCENARIO_MAX_TOKENS = 1500


# ============================================================================
# CONTEXT BUILDER - Gather data untuk LLM
# ============================================================================

class ContextBuilder:
    """Build comprehensive context from operational data"""
    
    @staticmethod
    def build_chatbox_context(location: str = "PIT A") -> Dict[str, Any]:
        """
        Gather all relevant operational data for chatbox LLM
        Data ini akan dikirim ke LLM sebagai context
        """
        from src.data.db_queries import (
            fetch_production_data,
            fetch_weather_condition,
            fetch_equipment_status
        )
        
        # 1. Production Status
        production = fetch_production_data(location)
        
        # 2. Weather Conditions
        weather = fetch_weather_condition(location)
        
        # 3. Equipment Status
        equipment = fetch_equipment_status(location)
        
        # 4. ML Predictions (from 7 models)
        ml_predictions = {
            "road_risk": "High (friction: 0.38, water: 15cm)",
            "equipment_failure_risk": "15% in next 24h",
            "port_operability": "85% operable",
            "fleet_performance": "78% efficiency",
            "cycle_time": "23.5 min average"
        }
        
        # 5. Historical Trends
        historical = {
            "last_7_days_production": [1476, 1390, 1343, 1262, 1580, 1450, 1520],
            "weather_impact_correlation": -0.72,
            "average_efficiency": 83.3
        }
        
        context = {
            "timestamp": datetime.now().isoformat(),
            "location": location,
            "production": {
                "current_ton": production.get("produce_ton", 0),
                "target_ton": production.get("target_ton", 0),
                "deviation_pct": production.get("deviation_pct", 0),
                "avg_per_day": production.get("avg_production_per_day", 0)
            },
            "weather": {
                "rainfall_mm": weather.get("rainfall_mm", 0),
                "wind_speed_kmh": weather.get("wind_speed_kmh", 0),
                "visibility_km": weather.get("visibility_km", 0),
                "extreme_weather": weather.get("extreme_weather_flag", False)
            },
            "equipment": {
                "active": equipment.get("active", 0),
                "standby": equipment.get("standby", 0),
                "under_repair": equipment.get("under_repair", 0),
                "maintenance": equipment.get("maintenance", 0)
            },
            "ml_predictions": ml_predictions,
            "historical": historical,
            "operational_constraints": {
                "safety_thresholds": {
                    "max_wind_speed": 40,
                    "min_visibility": 1.0,
                    "max_water_depth": 10,
                    "min_friction": 0.35
                },
                "target_efficiency": 85,
                "min_active_equipment": 8
            }
        }
        
        return context
    
    @staticmethod
    def build_scenario_context(location: str = "PIT A") -> Dict[str, Any]:
        """
        Build context for AI scenario generation
        Sama seperti chatbox tapi lebih fokus ke optimization
        """
        base_context = ContextBuilder.build_chatbox_context(location)
        
        # Add optimization-specific data
        base_context["optimization_goal"] = "Maximize production while maintaining safety"
        base_context["available_actions"] = [
            "Reallocate equipment between pits",
            "Change hauling routes",
            "Adjust shift schedules",
            "Postpone non-critical maintenance",
            "Request additional equipment"
        ]
        base_context["constraints"] = [
            "Safety must not be compromised",
            "Equipment health > 70%",
            "Weather conditions acceptable",
            "Budget within limits"
        ]
        
        return base_context


# ============================================================================
# PROMPT TEMPLATES
# ============================================================================

class PromptTemplates:
    """Store all prompt templates"""
    
    CHATBOX_SYSTEM_PROMPT = """You are MineWise AI, an expert mining operations assistant with deep knowledge of:
- Production optimization
- Weather impact analysis
- Equipment management
- Safety protocols
- Logistics coordination

Your role is to:
1. Analyze real-time operational data
2. Provide specific, actionable insights
3. Prioritize safety above all
4. Reference concrete data in your answers
5. Be concise but comprehensive

Current operational state:
{context_summary}

Respond in a professional, data-driven manner. Always cite specific metrics when making recommendations.
"""

    CHATBOX_HUMAN_PROMPT = """User Question: {question}

Detailed Current Data:
{context_json}

Provide a detailed answer based on the data above. Include:
- Direct answer to the question
- Supporting data/metrics
- Specific recommendations (if applicable)
- Potential risks or concerns
"""

    SCENARIO_SYSTEM_PROMPT = """You are an expert mining operations optimizer with 20+ years of experience.

Your task is to generate 3 distinct optimization scenarios based on current operational state.

Each scenario must include:
1. Clear, actionable title
2. Specific actions (with numbers: equipment counts, route changes, timing)
3. Expected impact (quantified: X% production increase, Y hours saved)
4. Implementation difficulty (Easy/Medium/Hard)
5. Risk assessment (Low/Medium/High)
6. Timeline (Immediate/Short-term/Long-term)

Guidelines:
- Scenario 1: Most recommended (balanced approach)
- Scenario 2: Conservative (minimize risk)
- Scenario 3: Aggressive (maximize output)

Safety is non-negotiable. All scenarios must comply with safety thresholds.
"""

    SCENARIO_HUMAN_PROMPT = """Generate 3 optimization scenarios for mining operations.

Current Operational State:
{context_json}

Optimization Goal: {goal}

Available Actions:
{actions}

Constraints:
{constraints}

Return response as JSON with this exact structure:
{{
    "scenarios": [
        {{
            "title": "Scenario 1 - Most Recommended",
            "description": "Detailed description with specific numbers",
            "actions": ["Action 1 with specifics", "Action 2 with specifics"],
            "expected_impact": {{
                "production_increase_pct": 15,
                "time_saved_hours": 3,
                "cost_impact": "Neutral"
            }},
            "difficulty": "Medium",
            "risk_level": "Low",
            "timeline": "Immediate (within 4 hours)"
        }}
    ],
    "analysis": "Brief analysis of why these scenarios were chosen",
    "data_sources": ["source1", "source2"],
    "confidence_score": 85
}}
"""


# ============================================================================
# MAIN LLM HANDLER
# ============================================================================

class MineWiseLLM:
    """Main LLM handler for MineWise system"""
    
    def __init__(self, api_key: str = None):
        """Initialize LLM with API key"""
        self.api_key = api_key or LLMConfig.OPENAI_API_KEY
        
        # Initialize ChatOpenAI
        self.chatbox_llm = ChatOpenAI(
            model=LLMConfig.MODEL_NAME,
            temperature=LLMConfig.CHATBOX_TEMPERATURE,
            max_tokens=LLMConfig.CHATBOX_MAX_TOKENS,
            openai_api_key=self.api_key
        )
        
        self.scenario_llm = ChatOpenAI(
            model=LLMConfig.MODEL_NAME,
            temperature=LLMConfig.SCENARIO_TEMPERATURE,
            max_tokens=LLMConfig.SCENARIO_MAX_TOKENS,
            openai_api_key=self.api_key
        )
        
        # Initialize memory for conversation
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
        
        # Create chains
        self._setup_chains()
    
    def _setup_chains(self):
        """Setup LangChain chains for different use cases"""
        
        # Chatbox chain
        chatbox_system_template = SystemMessagePromptTemplate.from_template(
            PromptTemplates.CHATBOX_SYSTEM_PROMPT
        )
        chatbox_human_template = HumanMessagePromptTemplate.from_template(
            PromptTemplates.CHATBOX_HUMAN_PROMPT
        )
        chatbox_prompt = ChatPromptTemplate.from_messages([
            chatbox_system_template,
            chatbox_human_template
        ])
        
        self.chatbox_chain = LLMChain(
            llm=self.chatbox_llm,
            prompt=chatbox_prompt,
            verbose=False  # Set True for debugging
        )
        
        # Scenario generation chain
        scenario_system_template = SystemMessagePromptTemplate.from_template(
            PromptTemplates.SCENARIO_SYSTEM_PROMPT
        )
        scenario_human_template = HumanMessagePromptTemplate.from_template(
            PromptTemplates.SCENARIO_HUMAN_PROMPT
        )
        scenario_prompt = ChatPromptTemplate.from_messages([
            scenario_system_template,
            scenario_human_template
        ])
        
        self.scenario_chain = LLMChain(
            llm=self.scenario_llm,
            prompt=scenario_prompt,
            verbose=False
        )
    
    def generate_chatbox_response(
        self, 
        user_question: str, 
        location: str = "PIT A"
    ) -> Dict[str, Any]:
        """
        Generate AI response for chatbox
        
        Args:
            user_question: User's question
            location: Mine location
            
        Returns:
            Dict with ai_answer, data_sources, steps, etc.
        """
        # Build context
        context = ContextBuilder.build_chatbox_context(location)
        
        # Create summary for system prompt
        context_summary = f"""
Location: {context['location']}
Production: {context['production']['current_ton']} / {context['production']['target_ton']} ton ({context['production']['deviation_pct']}% deviation)
Weather: {context['weather']['rainfall_mm']}mm rain, {context['weather']['wind_speed_kmh']}km/h wind
Equipment: {context['equipment']['active']} active, {context['equipment']['under_repair']} under repair
"""
        
        # Call LLM
        response = self.chatbox_chain.run(
            context_summary=context_summary,
            context_json=json.dumps(context, indent=2),
            question=user_question
        )
        
        # Generate processing steps
        steps = [
            f"Analyzed current state at {context['location']}",
            "Retrieved production, weather, and equipment data",
            "Consulted ML predictions from 7 models",
            "Generated recommendation based on operational constraints"
        ]
        
        # Identify data sources used
        data_sources = {
            "production": "fct_operasional_alat",
            "weather": "dim_cuaca_harian",
            "equipment": "dim_alat_berat",
            "ml_models": "7 ML prediction models"
        }
        
        # Quick follow-up questions
        quick_questions = [
            "What's the optimal equipment allocation?",
            "Which road has highest risk today?",
            "How will weather impact next shift?",
            "Any vessel delay risks?"
        ]
        
        return {
            "ai_answer": response.strip(),
            "ai_time": datetime.now().strftime("%H:%M"),
            "human_answer": user_question,
            "human_time": datetime.now().strftime("%H:%M"),
            "steps": steps,
            "data_sources": data_sources,
            "quick_questions": quick_questions
        }
    
    def generate_scenarios(
        self, 
        location: str = "PIT A",
        optimization_goal: str = "Maximize production while maintaining safety"
    ) -> Dict[str, Any]:
        """
        Generate AI-powered optimization scenarios
        
        Args:
            location: Mine location
            optimization_goal: What to optimize for
            
        Returns:
            Dict with scenarios, analysis, etc.
        """
        # Build context
        context = ContextBuilder.build_scenario_context(location)
        
        # Call LLM
        response_text = self.scenario_chain.run(
            context_json=json.dumps(context, indent=2),
            goal=optimization_goal,
            actions=json.dumps(context['available_actions'], indent=2),
            constraints=json.dumps(context['constraints'], indent=2)
        )
        
        # Parse JSON response
        try:
            scenarios = json.loads(response_text)
        except json.JSONDecodeError:
            # Fallback if LLM doesn't return valid JSON
            scenarios = {
                "scenarios": [
                    {
                        "title": "Scenario 1 - Data Processing Error",
                        "description": "Unable to parse LLM response. Using fallback scenarios.",
                        "actions": ["Review LLM output", "Check JSON formatting"],
                        "expected_impact": {"production_increase_pct": 0},
                        "difficulty": "N/A",
                        "risk_level": "N/A",
                        "timeline": "N/A"
                    }
                ],
                "analysis": "Error in response processing",
                "data_sources": ["Error"],
                "confidence_score": 0
            }
        
        # Add metadata
        scenarios["analysis_sources"] = "Weather API, Equipment Store, Road Monitoring, Vessel Tracking, ML Models"
        scenarios["generated_at"] = datetime.now().isoformat()
        
        return scenarios


# ============================================================================
# USAGE EXAMPLES
# ============================================================================

def example_chatbox_usage():
    """Example: How to use LLM for chatbox"""
    
    # Initialize LLM
    llm = MineWiseLLM(api_key="your-openai-api-key")
    
    # User asks a question
    user_question = "What is the current production status in PIT A?"
    
    # Generate AI response
    response = llm.generate_chatbox_response(
        user_question=user_question,
        location="PIT A"
    )
    
    print("AI Answer:", response['ai_answer'])
    print("Data Sources:", response['data_sources'])
    print("Steps:", response['steps'])


def example_scenario_usage():
    """Example: How to use LLM for scenario generation"""
    
    # Initialize LLM
    llm = MineWiseLLM(api_key="your-openai-api-key")
    
    # Generate optimization scenarios
    scenarios = llm.generate_scenarios(
        location="PIT A",
        optimization_goal="Maximize production while maintaining safety"
    )
    
    print("Generated Scenarios:")
    for i, scenario in enumerate(scenarios['scenarios'], 1):
        print(f"\n{i}. {scenario['title']}")
        print(f"   Description: {scenario['description']}")
        print(f"   Impact: {scenario['expected_impact']}")
        print(f"   Difficulty: {scenario['difficulty']}")
        print(f"   Risk: {scenario['risk_level']}")


# ============================================================================
# INTEGRATION WITH FRONTEND_ENDPOINTS.PY
# ============================================================================

"""
CARA INTEGRASI DI frontend_endpoints.py:

1. Import LLM handler:
   from src.ai.llm_handler import MineWiseLLM

2. Initialize LLM (di top-level, outside functions):
   llm = MineWiseLLM(api_key=os.getenv("OPENAI_API_KEY"))

3. Update chatbox endpoint:
   
   @router.post("/chatbox")
   async def chatbox_interaction(request: ChatboxRequest):
       try:
           # Generate AI response with LLM
           response = llm.generate_chatbox_response(
               user_question=request.human_answer,
               location=request.context.get("location", "PIT A")
           )
           
           logger.info(f"✓ Chatbox LLM response generated")
           return response
           
       except Exception as e:
           logger.error(f"Chatbox LLM error: {e}")
           raise HTTPException(status_code=500, detail=str(e))

4. Update AI recommendation:

   def generate_ai_scenarios() -> Dict[str, Any]:
       '''Generate AI recommendation scenarios with LLM'''
       try:
           scenarios = llm.generate_scenarios(
               location="PIT A",
               optimization_goal="Maximize production while maintaining safety"
           )
           return scenarios
       except Exception as e:
           logger.error(f"Scenario generation error: {e}")
           # Fallback to static scenarios if LLM fails
           return fallback_scenarios()

5. Add .env variables:
   OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
   LLM_MODEL=gpt-4-turbo-preview
   LLM_TEMPERATURE=0.3
"""


if __name__ == "__main__":
    print("MineWise LLM Implementation Example")
    print("="*50)
    print("\nFor actual usage:")
    print("1. Set OPENAI_API_KEY environment variable")
    print("2. Install: pip install langchain openai")
    print("3. Import and initialize MineWiseLLM class")
    print("4. Call generate_chatbox_response() or generate_scenarios()")
    print("\nSee usage examples in this file for details.")
