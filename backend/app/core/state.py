from enum import Enum


class ConversationState(str, Enum):
    DISCOVERY = "discovery"
    IDEA_GENERATION = "idea_generation"
    IDEA_ANALYSIS = "idea_analysis"
    NICHE_REFINEMENT = "niche_refinement"
    MONETIZATION_STRATEGY = "monetization_strategy"
    CONTENT_PLANNING = "content_planning"
    READINESS_EVALUATION = "readiness_evaluation"
    SOFT_CONVERSION = "soft_conversion"
