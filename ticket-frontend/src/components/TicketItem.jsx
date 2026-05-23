import { useState } from "react"
import { createNote, deleteTicket } from "../api/tickets"

export default function TicketItem({ticket,onClose,onEdit,loadTickets,setClosingTicket}){
    const [note,setNote] = useState("")

    const handleAddNote = async () =>{
        if(!note.trim()) return
        console.log(ticket)
        const newNote = await createNote(ticket.id,note)
        
        if (newNote){
            ticket.notes.push(newNote)
            loadTickets()
            setNote("")
        }
    }


    return(
        <div className="card mb-2">
            <div className="card-body">
            <h3>{ticket.title}</h3>
            <p>{ticket.description}</p>
            <h6 className="mt-3">Notes</h6>
            {
                ticket.notes.length === 0 ? (<p>Not notes yet</p>):
                (<ul className="list-group mb-3">
                  {
                    ticket.notes.map((note)=>(
                        <li key={note.id} className="list-group-item">
                          {note.content}
                        </li>
                    ))
                  }
                </ul>)
            }

            <div className="mt-2">
                <input className="form-control mb-2" placeholder="Add.note..." value={note} onChange={(e)=>setNote(e.target.value)} />
                <div className="d-flex justify-content-end">
                    <button className="btn btn-primary btn-sm" onClick={handleAddNote}>Add Note</button>
                </div>
                
            </div>

            <p>Status: {ticket.status}</p>
            <p>ID: {ticket.id}</p>
            
            <div className="d-flex justify-content-end">
            <button className="btn btn-success btn-sm ms-1" onClick={()=>onEdit(ticket)}>Edit</button>

            {ticket.status!=="closed"&& (
                <button className="btn btn-warning btn-sm ms-1" onClick={()=>onClose(ticket.id)}>Close</button>
            )}

            <button className="btn btn-danger btn-sm ms-1" onClick={()=>setClosingTicket(ticket.id)}>Delete</button>
            </div>
            </div>
        </div>
    )
}