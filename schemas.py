from pydantic import BaseModel, StringConstraints
from datetime import datetime
from typing import List, Annotated

class TicketCreate(BaseModel):
    title: Annotated[str, StringConstraints(min_length=3)]
    description: Annotated[str, StringConstraints(min_length=5)]

class TicketUpdate(BaseModel):
    title: Annotated[str, StringConstraints(min_length=3)]
    description: Annotated[str, StringConstraints(min_length=5)]

class NoteCreate(BaseModel):
    content:str

class NoteResponse(BaseModel):
    id: int
    content: str 
    created_at: datetime 

    class Config:
        from_attributes = True

class TicketResponse(BaseModel):
    id: int 
    title: str 
    description: str
    status: str
    created_at: datetime
    closed_at: datetime | None
    notes: List[NoteResponse] 

    class Config:
        from_attributes = True 


