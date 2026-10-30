from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

# --- Sub-schemas for RCA Structured Components ---

class WhyItem(BaseModel):
    why_number: int
    question: str
    answer: str
    category: Optional[str] = "Process"
    is_confirmed: bool = False

class FishboneData(BaseModel):
    man: List[str] = []
    machine: List[str] = []
    material: List[str] = []
    method: List[str] = []
    measurement: List[str] = []
    environment: List[str] = []

class RootCauseItem(BaseModel):
    id: str
    cause_statement: str
    category: str  # e.g., "Equipment / Calibration", "Method / SOP"
    is_primary: bool = False
    confidence: float = 0.85
    rationale: str
    status: str = "AI Suggested"  # "AI Suggested" vs "QA Confirmed"

class EvidenceGapItem(BaseModel):
    id: str
    item: str
    category: str
    why_needed: str
    priority: str = "High"  # High, Medium, Low
    status: str = "Pending"  # Pending, Requested, Collected

class CAPAItem(BaseModel):
    id: str
    type: str  # "Corrective" or "Preventive"
    description: str
    owner: str
    target_date: str
    rationale: str
    status: str = "Proposed"  # Proposed, Approved, In Progress, Completed

# --- Investigation Schemas ---

class InvestigationBase(BaseModel):
    deviation_number: str
    title: str
    facility: Optional[str] = "API Synthesis Plant 1"
    product_name: str
    batch_number: str
    date_occurred: Optional[str] = None
    severity: Optional[str] = "Major"
    status: Optional[str] = "Under Investigation"
    cqa_affected: Optional[str] = None
    event_description: Optional[str] = None
    immediate_containment: Optional[str] = None
    investigation_approach: Optional[str] = "Combined (5 Whys + Fishbone)"
    
    five_whys: List[Dict[str, Any]] = []
    fishbone: Dict[str, List[str]] = {}
    root_causes: List[Dict[str, Any]] = []
    missing_evidence: List[Dict[str, Any]] = []
    capa_items: List[Dict[str, Any]] = []
    
    investigator_notes: Optional[str] = None
    source_document_name: Optional[str] = None

class InvestigationCreate(InvestigationBase):
    pass

class InvestigationUpdate(InvestigationBase):
    deviation_number: Optional[str] = None
    title: Optional[str] = None
    product_name: Optional[str] = None
    batch_number: Optional[str] = None

class InvestigationResponse(InvestigationBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- AI Extraction Request & Response ---

class AIExtractRequest(BaseModel):
    incident_text: str = Field(..., description="Raw text of the deviation, incident note, or pasted email")
    source_type: Optional[str] = "text"  # "text", "email", "pdf"
    document_name: Optional[str] = "Direct Input"

class AIExtractResponse(BaseModel):
    deviation_number: str
    title: str
    facility: str
    product_name: str
    batch_number: str
    date_occurred: str
    severity: str
    cqa_affected: str
    event_description: str
    immediate_containment: str
    five_whys: List[Dict[str, Any]]
    fishbone: Dict[str, List[str]]
    root_causes: List[Dict[str, Any]]
    missing_evidence: List[Dict[str, Any]]
    capa_items: List[Dict[str, Any]]
    ai_summary: str
    llm_source: str = "Groq (llama-3.3-70b-versatile)"
