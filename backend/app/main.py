from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models import Investigation
from app.routers import ai_rca, investigations

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="Pharmaceutical API Root Cause Analysis (RCA) & CAPA Module powered by LangGraph and Groq",
    version="1.0.0"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(ai_rca.router, prefix=settings.API_V1_PREFIX)
app.include_router(investigations.router, prefix=settings.API_V1_PREFIX)

@app.on_event("startup")
def seed_demo_data():
    """Seeds one initial completed investigation if database is empty for instant demo readiness."""
    db = SessionLocal()
    try:
        count = db.query(Investigation).count()
        if count == 0:
            demo_record = Investigation(
                deviation_number="DEV-2026-0310",
                title="Investigation into Related Substances Impurity C Excursion in Paracetamol Synthesis",
                facility="API Synthesis Plant 3 - Reactor Bay B",
                product_name="Paracetamol API (Acetaminophen)",
                batch_number="PRC-26-0419",
                date_occurred="2026-10-24",
                severity="Critical",
                status="QA Confirmed",
                cqa_affected="Related Substances (Impurity C 0.22% vs limit <0.15%)",
                event_description="During crystallization & acetylation of Paracetamol API batch PRC-26-0419, reactor temperature spiked to 92.4°C due to stuck cooling valve MV-102. Subsequent HPLC testing showed out-of-specification Impurity C levels.",
                immediate_containment="Batch quarantined in SAP warehouse. Retained mother liquor and raw material samples sent for urgent HPLC re-assay.",
                investigation_approach="Combined (5 Whys + Fishbone)",
                five_whys=[
                    {"why_number": 1, "question": "Why did the batch fail impurity C specification?", "answer": "Reaction temperature exceeded thermal stability limit during acetylation.", "category": "Temperature Control", "is_confirmed": True},
                    {"why_number": 2, "question": "Why did temperature exceed the limit?", "answer": "Secondary cooling jacket valve MV-102 was restricted to 30% opening.", "category": "Valve Actuation", "is_confirmed": True},
                    {"why_number": 3, "question": "Why did MV-102 fail to open?", "answer": "Pneumatic air pressure dropped to 3.8 bar due to clumping in line desiccant.", "category": "Pneumatics", "is_confirmed": True},
                    {"why_number": 4, "question": "Why was the line desiccant clumped?", "answer": "Preventive maintenance interval on Air Dryer AD-03 had lapsed by 45 days.", "category": "Maintenance", "is_confirmed": True},
                    {"why_number": 5, "question": "Why was the overdue maintenance not caught?", "answer": "CMMS lacked automated escalation rule for unassigned maintenance work orders.", "category": "Quality Systems", "is_confirmed": True}
                ],
                fishbone={
                    "man": ["Operator delayed manual override of cooling valve", "Shift handover log lacked pneumatic warning"],
                    "machine": ["Cooling valve actuator seized", "Pneumatic air supply dropped below 4 bar"],
                    "material": ["Raw material Lot RM-882 moisture was near upper limit (0.48%)"],
                    "method": ["SOP-SYN-042 lacked explicit emergency cooling procedure"],
                    "measurement": ["HPLC column resolution was borderline during initial screening"],
                    "environment": ["Cleanroom ambient temperature was 32°C during summer peak"]
                },
                root_causes=[
                    {"id": "RC-1", "cause_statement": "Inadequate automated escalation protocol in CMMS for overdue preventive maintenance on critical utility air dryers.", "category": "Maintenance Governance", "is_primary": True, "confidence": 0.94, "rationale": "Directly led to unmitigated instrument air failure causing thermal overshoot.", "status": "QA Confirmed"}
                ],
                missing_evidence=[
                    {"id": "EVID-1", "item": "SCADA continuous temperature and pressure trend logs", "category": "Automation", "why_needed": "Confirm runaway duration", "priority": "High", "status": "Collected"},
                    {"id": "EVID-2", "item": "Calibration certificate for Reactor 3 thermowell", "category": "Metrology", "why_needed": "Verify temperature reading accuracy", "priority": "High", "status": "Collected"}
                ],
                capa_items=[
                    {"id": "CAPA-01", "type": "Corrective", "description": "Overhaul actuator on valve MV-102 and replace air filter regulator.", "owner": "Instrumentation Lead", "target_date": "2026-11-10", "rationale": "Restores cooling control loop to validated state.", "status": "Approved"},
                    {"id": "CAPA-02", "type": "Preventive", "description": "Implement automated CMMS alert escalation to QA Director for overdue PM tasks.", "owner": "Quality Assurance Manager", "target_date": "2026-12-01", "rationale": "Prevents utility maintenance lapses from recurring.", "status": "Approved"}
                ],
                investigator_notes="Reviewed and approved by Quality Assurance Lead. Verified that physical overhaul of MV-102 returned stroke response to normal.",
                source_document_name="DEV-2026-0310_Incident_Report.pdf"
            )
            db.add(demo_record)
            db.commit()
    except Exception as e:
        print(f"[Seed Warning] Could not seed demo record: {e}")
    finally:
        db.close()

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "database": settings.DATABASE_URL.split("://")[0],
        "groq_configured": bool(settings.GROQ_API_KEY)
    }
