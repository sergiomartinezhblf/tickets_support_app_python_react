const API_URL = import.meta.env.VITE_API_URL;

export async function getTickets() {
    try{
       const res = await fetch(`${API_URL}/tickets`)
       if (!res.ok) throw new Error("Error fetching tickets")
        return await res.json()
      } catch (error){
        console.error(error)
        return []
      }
    }

export async function createTicket(ticket) {
    try{
    const res = await fetch(`${API_URL}/tickets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ticket),
  })

     if (!res.ok) throw new Error("Error creating ticket")
     return await res.json()
    } catch (error){
        console.error(error)
        return null
      }
}

export async function closeTicket(id) {
  try{
  const res = await fetch(`${API_URL}/tickets/${id}/close`, {
    method: "PATCH",
  });

   if (!res.ok) throw new Error("Error closing ticket")
     return await res.json()
    } catch (error){
        console.error(error)
        return null
      }
}

export async function updateTicket(id,ticket) {
    try{
    const res = await fetch(`${API_URL}/tickets/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ticket),
  })

     if (!res.ok) throw new Error(`Error updating ticket: ${res.status} `)
     return await res.json()
    } catch (error){
        console.error(error)
        return null
      }
}

export async function createNote(ticketId,content){
  try{
    const res = await fetch(`${API_URL}/tickets/${ticketId}/notes`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({content}),
      })

   if (!res.ok) throw new Error(`Error creating note`) 
   return await res.json()  
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function deleteTicket(ticketId){
  try{
    const res = await fetch(`${API_URL}/tickets/${ticketId}`,
    {
      method:"DELETE",
    })
  
    if (!res.ok) throw new Error(`Error deleting ticket`) 
   return await res.json()  
  } catch (error) {
    console.error(error)
    return null
  
  }
}

export async function getTicketById(id) {
 try{
   const res = await fetch(`${API_URL}/tickets/${id}`)
   if (!res.ok) throw new Error(`Ticket not found`)
    return await res.json()
 } catch(error) {
    console.error(error)
    return null
 }
}