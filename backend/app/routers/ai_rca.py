from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from app.schemas import AIExtractRequest, AIExtractResponse
from app.services.document_parser import document_parser
from app.services.langgraph_rca import run_rca_investigation

router = APIRouter(prefix="/ai", tags=["AI RCA Investigation"])

SAMPLE_INCIDENTS = [
    {
        "id": "sample-1",
        "title": "Paracetamol API: Yield Drop & 4-Aminophenol Impurity C Spike",
        "product": "Paracetamol API (Acetaminophen)",
        "batch": "PRC-26-0419",
        "description": """URGENT INCIDENT LOG - API SYNTHESIS UNIT 3
Date: 2026-10-24 14:30 IST
Product: Paracetamol (Acetaminophen) BP/USP Grade
Batch: PRC-26-0419 | Reactor: R-301 (6000L Glass-Lined)

Event Summary:
During final QC release testing of Batch PRC-26-0419, HPLC chromatography revealed Related Substances Impurity C (4-Aminophenol) at 0.22%, exceeding the pharmacopeial specification limit of NMT 0.15%. Additionally, total crude synthesis yield dropped to 68.2% against historical average of 84.5%.

Process Observations:
At 14:15 during the acetylation stage, the batch operator observed that the reaction temperature spiked to 92.4°C (SOP target: 78°C - 82°C). The cooling jacket pneumatic valve MV-102 failed to open past 30%, despite automated DCS demand reaching 100%. Shift supervisor noted instrument air pressure on the line had dropped to 3.8 bar. Shift handover log from prior night shift did not flag fluctuating pressure.

Containment Taken:
1. Batch PRC-26-0419 immediately placed on QA Hold in SAP.
2. Downstream centrifugation and fluid bed drying halted.
3. Retention samples of starting material 4-Aminophenol (Lot RM-882) and mother liquor sent for re-assay."""
    },
    {
        "id": "sample-2",
        "title": "Amoxicillin Trihydrate API: Out-of-Spec Dissolution & Large Crystals",
        "product": "Amoxicillin Trihydrate Bulk API",
        "batch": "AMX-2026-1102",
        "description": """DEVIATION REPORT - CRYSTALLIZATION & STERILE UNIT 4
Date: 2026-10-26 09:15
Product: Amoxicillin Trihydrate Powder
Batch: AMX-2026-1102 | Crystallizer: CR-402

Event Description:
Physical testing of the finished crystalline API powder showed Out-of-Specification (OOS) Dissolution Rate at 15 minutes (71% vs limit NLT 85%). Malvern Laser Diffraction particle size analysis showed abnormal coarse agglomerates with D90 = 142µm (Spec: D90 < 110µm).

Investigation Findings:
Review of the SCADA crystallization profile indicated that during the controlled acid-base precipitation phase, the variable-frequency drive (VFD) agitator speed unexpectedly dipped from 180 RPM to 95 RPM for 42 minutes due to an electrical inverter overheating alarm. When the agitator slowed, local super-saturation caused secondary nucleation and uncontrolled crystal agglomeration. Calibration record for the VFD tachometer had not been updated after the last quarterly motor overhaul.

Immediate Actions:
Quarantined 450 kg of bulk powder. Sampling plan initiated to test uniformity across the drum lot."""
    },
    {
        "id": "sample-3",
        "title": "Ceftriaxone Sodium Sterile API: Sub-Visible Particulate Outlier",
        "product": "Ceftriaxone Sodium Sterile API",
        "batch": "CEF-26-008",
        "description": """QUALITY DEVIATION MEMO - STERILE FINISHING FACILITY 2
Date: 2026-10-28 16:45
Product: Sterile Ceftriaxone Sodium API (Aseptic Crystallized)
Batch: CEF-26-008 | Cleanroom: Grade A Isolator ISO 5

Deviation Details:
Sterility and particulate matter testing per USP <788> light obscuration test revealed sub-visible particles >= 10µm at 42 particles/mL (Specification: NMT 25 particles/mL). Batch is rejected pending Root Cause Analysis.

Preliminary Inspection:
Microscopic FTIR characterization identified the particulate matter as PTFE (polytetrafluoroethylene) polymer fragments. Mechanical inspection of the sterile slurry transfer pump P-204 revealed worn mechanical seal fluoropolymer gaskets. Maintenance records show the pump was operated for 820 hours since last seal replacement, exceeding the recommended 600-hour preventive maintenance limit.

Containment:
Batch placed in quarantined vault. Sterile isolator line taken offline for sanitization and swab testing."""
    }
]

@router.get("/samples")
def get_sample_incidents():
    """Returns realistic pharmaceutical API deviation samples for 1-click evaluation."""
    return SAMPLE_INCIDENTS

@router.post("/extract-rca", response_model=AIExtractResponse)
def extract_rca_from_text(payload: AIExtractRequest):
    """
    Analyzes incident text/email using LangGraph and Groq,
    producing structured RCA form data.
    """
    try:
        cleaned_text = document_parser.clean_text_input(payload.incident_text)
        result = run_rca_investigation(
            raw_text=cleaned_text,
            source_type=payload.source_type or "text",
            document_name=payload.document_name or "Incident Input"
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI RCA processing error: {str(e)}")

@router.post("/upload-doc", response_model=AIExtractResponse)
async def upload_document_and_extract(
    file: UploadFile = File(...),
    source_type: Optional[str] = Form("pdf")
):
    """
    Accepts an uploaded incident PDF file or text file,
    extracts the text, and processes it through the LangGraph workflow.
    """
    try:
        content_bytes = await file.read()
        filename = file.filename or "uploaded_document"
        
        if filename.lower().endswith(".pdf"):
            extracted_text = document_parser.extract_from_pdf(content_bytes)
        else:
            extracted_text = content_bytes.decode("utf-8", errors="ignore")
            
        cleaned_text = document_parser.clean_text_input(extracted_text)
        result = run_rca_investigation(
            raw_text=cleaned_text,
            source_type="pdf" if filename.lower().endswith(".pdf") else "file",
            document_name=filename
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")
