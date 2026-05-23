import TicketItem from "./TicketItem"

export default function TicketList({tickets,onClose,onEdit,loadTickets,setClosingTicket}){
    if(!tickets||tickets.length===0){
        return <p>No tickets available</p>
    }

    return(
        <div>
            <h2>Tickts</h2>

            {
                tickets.map((ticket)=>(
                    <TicketItem
                       key={ticket.id}
                       ticket={ticket}
                       onClose={onClose}
                       onEdit={onEdit}
                       loadTickets={loadTickets}
                       setClosingTicket={setClosingTicket}
                    />
                ))
            }
        </div>
    )
}