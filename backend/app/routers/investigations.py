from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Investigation
from app.schemas import InvestigationCreate, InvestigationUpdate, InvestigationResponse

router = APIRouter(prefix="/investigations", tags=["Investigations"])

@router.get("", response_model=List[InvestigationResponse])
def list_investigations(
    status: Optional[str] = Query(None, description="Filter by investigation status"),
    search: Optional[str] = Query(None, description="Search by deviation number, product, or batch"),
    db: Session = Depends(get_db)
):
    """Retrieves all saved RCA investigations, with optional search and filtering."""
    query = db.query(Investigation)
    
    if status and status != "All":
        query = query.filter(Investigation.status == status)
        
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Investigation.deviation_number.ilike(search_filter)) |
            (Investigation.product_name.ilike(search_filter)) |
            (Investigation.batch_number.ilike(search_filter)) |
            (Investigation.title.ilike(search_filter))
        )
        
    return query.order_by(Investigation.created_at.desc()).all()

@router.get("/{investigation_id}", response_model=InvestigationResponse)
def get_investigation(investigation_id: int, db: Session = Depends(get_db)):
    """Retrieves a single investigation record by ID."""
    record = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Investigation record not found")
    return record

@router.post("", response_model=InvestigationResponse, status_code=201)
def create_investigation(payload: InvestigationCreate, db: Session = Depends(get_db)):
    """
    Saves an AI-assisted and user-reviewed RCA investigation to the database.
    If deviation_number already exists, appends timestamp or handles smoothly.
    """
    # Check if duplicate deviation number
    existing = db.query(Investigation).filter(Investigation.deviation_number == payload.deviation_number).first()
    if existing:
        # Create a unique deviation number suffix
        import time
        payload.deviation_number = f"{payload.deviation_number}-{int(time.time()) % 1000}"
        
    db_item = Investigation(**payload.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.put("/{investigation_id}", response_model=InvestigationResponse)
def update_investigation(
    investigation_id: int,
    payload: InvestigationUpdate,
    db: Session = Depends(get_db)
):
    """Updates an existing RCA investigation record."""
    record = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Investigation record not found")
        
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(record, field, value)
        
    db.commit()
    db.refresh(record)
    return record

@router.delete("/{investigation_id}")
def delete_investigation(investigation_id: int, db: Session = Depends(get_db)):
    """Deletes an investigation record from the database."""
    record = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Investigation record not found")
        
    db.delete(record)
    db.commit()
    return {"message": f"Investigation {record.deviation_number} deleted successfully"}
