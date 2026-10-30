# PharmaRCA: AI-Powered Root Cause Analysis (RCA) & CAPA Module
### Built for Active Pharmaceutical Ingredient (API) Manufacturing Quality Compliance

An end-to-end, cGMP-compliant AI system for investigating pharmaceutical deviations, performing **5 Whys** and **Ishikawa Fishbone (6M)** causal analyses, flagging missing investigation evidence, and formulating **Corrective and Preventive Actions (CAPA)**.

---

## 📌 Architecture & Tech Stack

| Layer | Technology | Key Responsibility |
|---|---|---|
| **Frontend** | React 18 + Redux Toolkit + Lucide | Interactive investigation workbench, AI intake drawer, dynamic 6-tab RCA review, confirmation workflows |
| **Backend** | Python 3.13 + FastAPI + Uvicorn | Async REST API, file upload handlers, validation schemas (Pydantic v2) |
| **AI Engine** | LangGraph + Groq (`llama-3.3-70b-versatile`) | Multi-node `StateGraph` causal pipeline with cGMP fallback heuristics |
| **Document Processing** | `pypdf` + regex text cleaners | Automated text extraction from PDF reports, batch records, and email memos |
| **Database** | SQLAlchemy (SQLite / PostgreSQL / MySQL) | Persistent storage of deviation records, 5 Whys causal trees, and CAPA commitments |

---

## 🔄 End-to-End Workflow

```mermaid
flowchart TD
    A[Deviation Intake: PDF / Email / Raw Text] --> B[FastAPI Document Parser Service]
    B --> C[LangGraph StateGraph Workflow]
    
    subgraph LangGraph AI Pipeline
        C1[Node 1: Extract Deviation Metadata & CQA] --> C2[Node 2: 5 Whys & 6M Fishbone Analysis]
        C2 --> C3[Node 3: Synthesize Root Causes & Hypotheses]
        C3 --> C4[Node 4: Detect Missing Evidence & Gaps]
        C4 --> C5[Node 5: Generate CAPA Recommendations]
    end
    
    C --> C1
    C5 --> D[AI Intake Panel: Structured Review & Preview]
    D --> E[Auto-Populate Redux Form State]
    E --> F[User Quality Review & Editing]
    F --> G[QA Signoff: Convert 'AI Suggested' → 'QA Confirmed']
    G --> H[Save Investigation to Database]
    H --> I[Investigation Records & Metrics Dashboard]
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Python 3.10+ (Tested on Python 3.13)
- Node.js 18+ (Tested on Node.js v24)
- (Optional) Groq API Key: [Get a free key here](https://console.groq.com/keys)

---

### 2. Backend Setup
Open a terminal in the root directory:

```bash
# 1. Activate Python virtual environment (if not already active)
.\venv\Scripts\activate   # On Windows
# or: source venv/bin/activate  # On Linux/macOS

# 2. Navigate to backend
cd backend

# 3. (Optional) Add your Groq API key in backend/.env
# GROQ_API_KEY=gsk_your_key_here
# If left blank, the system automatically runs on our smart pharmaceutical domain engine!

# 4. Start the FastAPI server
python run.py
```
> The backend runs at: **`http://localhost:8000`**  
> Interactive Swagger API docs: **`http://localhost:8000/docs`**

---

### 3. Frontend Setup
Open a second terminal:

```bash
# Navigate to frontend
cd frontend

# Start the Vite development server
npm run dev
```
> The frontend runs at: **`http://localhost:5173`**

---

## 🗄️ Database Configuration (PostgreSQL / MySQL / SQLite)

By default, the application runs on **SQLite** (`sqlite:///./rca_database.db`) so it works immediately out of the box with zero setup.

To switch to **PostgreSQL** or **MySQL**:
1. Open `backend/.env`
2. Update `DATABASE_URL`:
   ```env
   # PostgreSQL
   DATABASE_URL=postgresql://postgres:password@localhost:5432/rca_db

   # MySQL
   DATABASE_URL=mysql+pymysql://root:password@localhost:3306/rca_db
   ```
SQLAlchemy will automatically initialize all tables upon startup.

---

## 📋 PDF Requirements Compliance Matrix

| Requirement from PDF | Implementation in PharmaRCA |
|---|---|
| **API Manufacturing Context** | Models Critical Quality Attributes (CQAs) like *Related Substances Impurity C*, *Particle Size Distribution*, *Dissolution Rate*, *Quarantine Containment*. |
| **Document Intake (PDF, Text, Email)** | AI Intake drawer supports Pasted Incident Notes, Email memos, and native PDF uploads via `pypdf`. Includes 3 realistic one-click sample scenarios. |
| **Form Auto-Population Pattern** | AI panel extracts data and populates form fields following the reference video interaction pattern. |
| **5 Whys Analysis** | Interactive 5-level interrogative tree with questions, answers, categories, and QA confirmation toggles. |
| **Fishbone (Ishikawa 6M) Analysis** | 6M matrix (Man, Machine, Material, Method, Measurement, Environment) with causal factors and inline add/delete capabilities. |
| **Root Cause & Contributing Factors** | Classifies Primary Root Cause vs. Secondary Contributing Factor with confidence percentages and evidence rationale. |
| **AI Suggested vs. QA Confirmed** | **Mandatory cGMP Rule Enforced**: Root causes start as *AI Suggested* (amber badge) and require explicit investigator verification to become *QA Confirmed* (emerald badge). |
| **Missing Evidence Gaps** | Automatically flags missing SCADA historical logs, calibration certificates, raw material vendor CoAs, and cleaning swabs needed for regulatory defense. |
| **CAPA Recommendations** | Actionable Corrective and Preventive items with responsible departmental owner, completion date, and implementation rationale. |
| **Review & Edit Before Saving** | Quality professionals can edit every single field, text block, or table entry before committing to the database. |
| **Tech Stack** | React + Redux Toolkit frontend; Python + FastAPI backend; LangGraph + Groq AI; SQLAlchemy persistence. |

---

## 🎥 Recording Guide for Submission Videos

### 📹 Video 1: Product Demonstration (5–8 minutes)
Follow this flow while screen recording:
1. **Introduction (1 min)**:
   - Introduce yourself and the objective: an AI-assisted Root Cause Analysis (RCA) and CAPA module tailored for pharmaceutical API manufacturing deviations.
   - Show the clean dual-pane layout: Main Investigation Workbench on the left, AI Intake Panel on the right.
2. **AI Document Intake & Extraction (1.5 min)**:
   - In the AI Intake Panel, click **Samples** and choose *"Paracetamol API: Yield Drop & 4-Aminophenol Impurity C Spike"*.
   - Mention that users can also paste raw email memos or drag-and-drop a PDF deviation report.
   - Click **"Analyze & Populate RCA Form"**.
   - Show the LangGraph pipeline execution steps and the extraction summary breakdown.
3. **Form Auto-Population & Review (1 min)**:
   - Show how the form fields (Deviation number, Product, Batch, Severity, CQA, Event Description, Containment) automatically populated.
   - Demonstrate modifying a field (e.g. adjust severity or edit investigator notes).
4. **5 Whys & Fishbone (Ishikawa 6M) Analysis (1.5 min)**:
   - Click Tab 2 (**5 Whys**): Walk down the 5 levels from the thermal overshoot down to the overdue CMMS maintenance work order. Click *"Confirm Finding"*.
   - Click Tab 3 (**Fishbone**): Show the 6M categories (Man, Machine, Material, Method, Measurement, Environment). Add a quick custom factor to demonstrate interactivity.
5. **Root Causes & The Regulatory Signoff Rule (1 min)**:
   - Click Tab 4 (**Root Causes**): Explain the cGMP compliance rule: *AI-generated causes are strictly suggestions until verified by a qualified person*.
   - Click **"Confirm & Validate (QA Signoff)"** to switch status from *AI Suggested* to *QA Confirmed*.
6. **Evidence Gaps & CAPA Commitments (1 min)**:
   - Click Tab 5 (**Evidence Gaps**): Show missing SCADA trend logs and calibration certs. Mark one as *"Collected & Verified"*.
   - Click Tab 6 (**CAPA Plan**): Review Corrective vs. Preventive actions with owners and deadlines.
7. **Database Save & Records Dashboard (1 min)**:
   - Click **"Save Investigation"** in the top navbar. Show the success notification toast.
   - Switch to **"Saved Records"** tab in the navbar. Show the saved investigation in the searchable table and metrics dashboard.

---

### 💻 Video 2: Technical Walkthrough (5–10 minutes)
Follow this technical structure:
1. **Frontend Architecture (`React + Redux Toolkit`) (2.5 min)**:
   - Walk through `frontend/src/store/rcaSlice.js`: show how `currentForm`, 5 Whys, Fishbone, Root Causes, Evidence Gaps, and CAPA items are managed immutably.
   - Show `frontend/src/components/AIPanel.jsx` and `RCAForm.jsx`: explain the interaction pattern where AI extracts and auto-populates the Redux state, allowing reactive real-time editing.
2. **FastAPI Backend & API Endpoints (2 min)**:
   - Open `backend/app/main.py` and `backend/app/routers/`:
     - `POST /api/ai/extract-rca`: handles text/email extraction.
     - `POST /api/ai/upload-doc`: parses PDFs using `pypdf`.
     - `GET /api/investigations` and `POST /api/investigations`: CRUD persistence.
3. **Document Parser Service (1 min)**:
   - Open `backend/app/services/document_parser.py`: explain `pypdf.PdfReader` text extraction and text normalization.
4. **LangGraph StateGraph Workflow & Groq Integration (3 min)**:
   - Open `backend/app/services/langgraph_rca.py`:
     - Show the `RCAInvestigationState` TypedDict.
     - Walk through the 5 nodes: `extract_metadata` → `investigate_causality` → `synthesize_root_causes` → `detect_evidence_gaps` → `recommend_capa`.
     - Explain how `call_groq_json` calls Groq's `llama-3.3-70b-versatile` with structured JSON output.
     - Highlight the pharmaceutical heuristic fallback engine that guarantees 100% offline stability.
5. **Database Integration & Schema (1.5 min)**:
   - Open `backend/app/models.py` and `backend/app/database.py`: explain SQLAlchemy model with JSON column support for flexible RCA trees and CAPA items. Show seamless support for SQLite, PostgreSQL, and MySQL.

---

## 📂 Project Structure

```
Assignment2/
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI entrypoint, CORS, startup seeding
│   │   ├── config.py                   # Settings, Groq API key, Database URL
│   │   ├── database.py                 # SQLAlchemy engine, session, Base
│   │   ├── models.py                   # Investigation DB model
│   │   ├── schemas.py                  # Pydantic request/response schemas
│   │   ├── routers/
│   │   │   ├── ai_rca.py               # AI extraction & PDF upload routes
│   │   │   └── investigations.py       # CRUD endpoints for saved records
│   │   └── services/
│   │       ├── document_parser.py      # PDF & text parser service
│   │       └── langgraph_rca.py        # LangGraph StateGraph + Groq workflow
│   ├── sample_data/
│   │   ├── sample_deviation_report.pdf
│   │   ├── incident_paracetamol_yield_spike.txt
│   │   └── incident_amoxicillin_crystallization_oos.txt
│   ├── requirements.txt
│   ├── .env.example
│   ├── .env
│   └── run.py                          # Backend launcher
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx                    # React entrypoint with Redux Provider
│   │   ├── App.jsx                     # Layout, navigation, toast notifications
│   │   ├── index.css                   # Professional cGMP clinical design styles
│   │   ├── api/
│   │   │   └── rcaApi.js               # Axios backend client
│   │   ├── store/
│   │   │   ├── index.js                # Redux store config
│   │   │   ├── rcaSlice.js             # Investigation state & actions
│   │   │   └── uiSlice.js              # Drawer, tabs, and loading state
│   │   └── components/
│   │       ├── Navbar.jsx              # Header bar with mode switches & save
│   │       ├── AIPanel.jsx             # AI intake drawer (Text/Email/PDF/Samples)
│   │       ├── RCAForm.jsx             # Master 6-tab investigation form
│   │       ├── FiveWhysView.jsx        # 5 Whys interactive causal ladder
│   │       ├── FishboneView.jsx        # Ishikawa 6M interactive diagram
│   │       ├── RootCausesView.jsx      # Suggested vs Confirmed root causes
│   │       ├── EvidenceGapsView.jsx    # Missing evidence verification checklist
│   │       ├── CAPATable.jsx           # Corrective & Preventive action planner
│   │       └── SavedInvestigations.jsx # Past investigations & metrics dashboard
│   ├── package.json
│   └── vite.config.js
└── README.md
```
