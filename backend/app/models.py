import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from app.database import Base

class Investigation(Base):
    __tablename__ = "investigations"

    id = Column(Integer, primary_key=True, index=True)
    deviation_number = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    facility = Column(String(100), default="API Synthesis Plant 1")
    product_name = Column(String(100), nullable=False)
    batch_number = Column(String(100), nullable=False)
    date_occurred = Column(String(50), nullable=True)
    severity = Column(String(50), default="Major")  # Minor, Major, Critical
    status = Column(String(50), default="Under Investigation")  # Draft, Under Investigation, QA Confirmed, Closed
    
    cqa_affected = Column(String(255), nullable=True)  # Critical Quality Attribute
    event_description = Column(Text, nullable=True)
    immediate_containment = Column(Text, nullable=True)
    
    investigation_approach = Column(String(50), default="Combined (5 Whys + Fishbone)")
    
    # Structured RCA & CAPA stored as JSON for flexibility and speed
    five_whys = Column(JSON, default=list)
    fishbone = Column(JSON, default=dict)
    root_causes = Column(JSON, default=list)
    missing_evidence = Column(JSON, default=list)
    capa_items = Column(JSON, default=list)
    
    investigator_notes = Column(Text, nullable=True)
    source_document_name = Column(String(255), nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
