from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from datetime import datetime

import models
import schemas
from database import SessionLocal,engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    #allow_origins=["http://localhost:5173","http://127.0.0.1:5173"],
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

#dependencia de BD
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#crear ticket
@app.post("/tickets",response_model=schemas.TicketResponse)
def create_ticket(ticket:schemas.TicketCreate,db:Session= Depends(get_db)):
    db_ticket = models.Ticket(
        title=ticket.title,
        description=ticket.description
    )

    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)

    return db_ticket

#listar tickets 
@app.get("/tickets",response_model=list[schemas.TicketResponse])
def get_tickets(status:str|None=None,db:Session = Depends(get_db)):

    query= db.query(models.Ticket).options(joinedload(models.Ticket.notes))
    if status:
        query = query.filter(models.Ticket.status == status)

    tickets = query.all()
    return tickets

#agregar nota
@app.post("/tickets/{ticket_id}/notes",response_model=schemas.NoteResponse)
def add_note(ticket_id:int,note:schemas.NoteCreate,db: Session= Depends(get_db)):
    db_ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()

    if not db_ticket:
        raise HTTPException(status_code=404, detail= "Ticket not found")
    
    db_note = models.Note(
        content= note.content,
        ticket_id = ticket_id
    )

    db.add(db_note)
    db.commit()
    db.refresh(db_note)

    return db_note

#cerrar ticket
@app.patch("/tickets/{ticket_id}/close",response_model=schemas.TicketResponse)
def close_ticket(ticket_id:int,db:Session = Depends(get_db)):

    db_ticket= db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    
    if not db_ticket:
        raise HTTPException(status_code=404, detail= "Ticket not found")
    
    if db_ticket.status == "closed":
        raise HTTPException(status_code=400, detail= "Ticket alredy closed")
    
    db_ticket.status = "closed"
    db_ticket.closed_at = datetime.utcnow()

    db.commit()
    db.refresh(db_ticket)

    return db_ticket

#obtener ticket por ID
@app.get("/tickets/{ticket_id}",response_model=schemas.TicketResponse)
def get_tickets_by_id(ticket_id:int, db:Session = Depends(get_db)):

    ticket = (db.query(models.Ticket).options(joinedload(models.Ticket.notes)).filter(models.Ticket.id==ticket_id).first())

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    return ticket

#actualizar ticket
@app.patch("/tickets/{ticket_id}",response_model=schemas.TicketResponse)
def update_ticket(ticket_id:int,ticket_update:schemas.TicketUpdate,db:Session=Depends(get_db)):

    db_ticket= db.query(models.Ticket).filter(models.Ticket.id==ticket_id).first()


    if not db_ticket:
        raise HTTPException(status_code=404,detail="Ticket not found")

    update_data= ticket_update.dict(exclude_unset=True)

    for key,value in update_data.items():
        if hasattr(db_ticket,key):
            setattr(db_ticket,key,value)
    

    db.commit()
    db.refresh(db_ticket)

    return db_ticket

#eliminar ticket
@app.delete("/tickets/{ticket_id}")
def delete_ticket(ticket_id:int,db:Session=Depends(get_db)):

    ticket = db.query(models.Ticket).filter(models.Ticket.id==ticket_id).first()

    if not ticket:
        raise HTTPException(status_code=404,detail="Ticket not found")

    db.delete(ticket)
    db.commit()

    return {"message":"Ticket deleted"}

@app.get("/test")
def test():
    return {"ok":True}