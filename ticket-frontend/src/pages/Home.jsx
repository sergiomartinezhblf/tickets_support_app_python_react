import { useEffect, useState } from "react";
import { getTickets, createTicket, closeTicket, deleteTicket,getTicketById } from "../api/tickets";
import TicketList from "../components/TicketList";

export default function Home() {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTicket,setEditingTicket] = useState(null);
  const [closingTicket,setClosingTicket] = useState(null);
  const [searchId,setSearchId] = useState("");
  const [searchedTicket,setSearchedTicket] = useState(null);
  const [searchError,setSearchError] = useState("")
  const [searchLoading, setSearchLoading] = useState(false)

  const loadTickets = async () => {
    const data = await getTickets()
    if (data) setTickets(data);
  }

  useEffect(() => {
    loadTickets();
  }, []);

  const handleCreate = async () => {
    if(!title||!description) return

    const newTicket = await createTicket({ title, description })

    if (newTicket){
       setTickets([...tickets,newTicket])
       setTitle("");
       setDescription("");
    }
    
  };

  const handleClose = async (id) => {
    const updated = await closeTicket(id)
    if (updated){
      setTickets(
        tickets.map((t)=> t.id==id ? updated: t)
      )
    }}
    
  const handleEdit = (ticket) =>{
    setEditingTicket(ticket)
    setTitle(ticket.title)
    setDescription(ticket.description)
  }

  const handleDelete = async (ticketId) =>{
           if (!ticketId) return
           await deleteTicket(ticketId)
           setClosingTicket(null)
           loadTickets()
  
      }
  
  const closeModal = () =>{
    setEditingTicket(null)
    setTitle("")
    setDescription("")
  }

  const closeModalDelete = () =>{
    setClosingTicket(null)
  }

  const handleUpdate = async () =>{
    const updated = await updateTicket(editingTicket.id,{title,description})
    if (updated){
        setTickets(
            tickets.map((t)=> t.id==editingTicket.id? updated: t)
        )
    }
    closeModal()
  }

  const handleSearch = async () =>{
    if(!searchId) return

    setSearchLoading(true)
    setSearchError("")
    setSearchedTicket(null)

    const data = await getTicketById(searchId)

    if (data) {
      setSearchedTicket(data)
    } else{
      setSearchError("Ticket not found")
    }

    setSearchLoading(false)
  }

  

  return (
    <div style={{ padding: 20 }}>
      <h1>Tickets System</h1>

      {/*SEARCH INPUT*/}
      <div className="card p-3 mb-4">
         <h5 className="mb-3">Search Ticket</h5>
         <div className="input-group">
            <input type="number" className="form-control"  placeholder="Enter ticket ID..." value={searchId} onChange={(e)=>setSearchId(e.target.value)}/>
            <button className="btn btn-primary" onClick={handleSearch} disabled={!searchId||searchLoading}>
              {searchLoading ? "Searching...":"Search"}
            </button>          
         </div>
         {
          searchError && ( <div className="alert alert-danger mt-3 mb-0">{searchError}</div>)
         }
      </div>

      {/*CARD TICKED FOUND */}
      {searchedTicket && (
      <div className="card mb-4 border-success">
        <div className="card-header bg-success text-white">
          Ticket Found
       </div>

        <div className="card-body">
           <h5 className="card-title">{searchedTicket.title}</h5>

          <p className="card-text">
            {searchedTicket.description}
          </p>

          <p className="mb-1">
             <b>ID:</b> {searchedTicket.id}
          </p>

         <p className="mb-1">
            <b>Status:</b>{" "}
            <span
               className={
                searchedTicket.status === "closed"
                ? "badge bg-danger"
              : "badge bg-success"
              }
             >
                 { searchedTicket.status}
              </span>
          </p>

          {searchedTicket.notes.length>0? (
            <>
            <b>Notes:</b>
            <ul className="mb-1 list-group">
              {
                searchedTicket.notes.map((note)=><li key={note.id} className="list-group-item">{note.content}</li>)
              }
            </ul>
            </>
           ):null}
          

             <small className="text-muted">
              Created: {new Date(searchedTicket.created_at).toLocaleString()}
            </small>
            {searchedTicket.closed_at && 
            <small className="text-muted ms-2">
              Closed: {new Date(searchedTicket.closed_at).toLocaleString()}
            </small>
            }
        </div>
       </div>
      )}

      {/* FORM */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">

        <h4 className="card-title mb-4">
         Create New Ticket
        </h4>

        <div className="mb-3">
          <label className="form-label">
           Title
          </label>

         <input
        type="text"
        className="form-control"
        placeholder="Enter ticket title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
         />
       </div>

        <div className="mb-3">
        <label className="form-label">
          Description
        </label>

        <textarea
        className="form-control"
        rows="4"
        placeholder="Describe the issue..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        />
       </div>

    <div className="d-flex justify-content-end">
      <button
        className="btn btn-primary"
        onClick={handleCreate}
        disabled={!title || !description}
      >
        Create Ticket
      </button>
    </div>

  </div>
</div>

      <hr />

      {/* LIST COMPONENT */}

      <TicketList
         tickets={tickets}
         onClose={handleClose}
         onEdit={handleEdit}
         loadTickets={loadTickets}
         setClosingTicket={setClosingTicket}
      />

    {editingTicket && (
    <div className="modal show d-block" tabIndex="-1">
     <div className="modal-dialog">
      <div className="modal-content">

        <div className="modal-header">
          <h5 className="modal-title">Edit Ticket</h5>
          <button className="btn-close" onClick={closeModal}></button>
        </div>

        <div className="modal-body">
          <input
            className="form-control mb-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={closeModal}>
            Cancel
          </button>

          <button className="btn btn-primary" onClick={handleUpdate}>
            Save changes
          </button>
        </div>

      </div>
    </div>
    </div>
   )}
  
  {closingTicket && (
    <div className="modal show d-block" tabIndex="-1">
    <div className="modal-dialog">
     <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Deliting Ticket</h5>
        <button type="button" className="btn-close" onClick={closeModalDelete}></button>
      </div>
      <div className="modal-body">
        <p>Do you want delete the ticket?</p>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={closeModalDelete} >Cancel</button>
        <button type="button" className="btn btn-danger" onClick={()=>handleDelete(closingTicket)}>Delete</button>
      </div>
    </div>
   </div>
  </div>
  )}

    </div>
  );
}