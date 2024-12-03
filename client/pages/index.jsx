import axios from 'axios'
import Link from 'next/link';
import React from 'react'

const LandingPage = ({data,tickets}) => {
  //axios.get('/api/users/currentuser');
  console.log(data);
  console.log(tickets);
  
  return (
    <div className="container">
      <h3>Tickets</h3>
      <table className='table'>
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {
              tickets && tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.title}</td>
                  <td>{ticket.price}</td>
                  <td>
                  <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
                    View
                  </Link>
                  </td>
                </tr>
              ))
            }
          </tbody>
      </table>
    </div>
  )
}

LandingPage.getInitialProps = async (context,client,currentUser) => {
    const { data } = await client.get('/api/tickets');
    return { tickets: data };
}

export default LandingPage