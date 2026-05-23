from sqlalchemy import Column, Integer, String, Text, DateTime,ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from database import Base

class Ticket(Base):
    __tablename__="tickets"

    id=Column(Integer,primary_key=True, index=True)
    title=Column(String,nullable=False)
    description=Column(Text,nullable=False)
    status=Column(String,default="open")
    created_at=Column(DateTime(timezone=True),server_default=func.now())
    closed_at=Column(DateTime(timezone=True),nullable=True)

    notes = relationship("Note", back_populates="ticket",cascade="all, delete-orphan")

class Note(Base):
    __tablename__="notes"

    id=Column(Integer,primary_key=True,index=True)
    ticket_id=Column(Integer,ForeignKey("tickets.id"))
    content=Column(Text,nullable=False)
    created_at=Column(DateTime(timezone=True),server_default=func.now())

    ticket = relationship("Ticket", back_populates="notes")
