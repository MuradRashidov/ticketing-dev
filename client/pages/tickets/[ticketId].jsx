import React from 'react'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'

const TicketDetails = ({ticket}) => {
    const { doRequest, errors } = useRequest({
        url: `/api/orders`,
        method: 'post',
        body: { ticketId: ticket.id },
        onSuccess: (order) => Router.push('/orders/[orderId]',`/orders/${order.id}`)
    });
  return (
    <div>
        <h4>{ticket.title}</h4>
        <p>Price: {ticket.price}</p>
        {errors[0] && <div className='alert alert-danger mt-2'>
                {
                    errors[0].message
                }
        </div>}
        <button onClick={() => doRequest()} className='btn btn-info'>Purchase</button>
    </div>
  )
}
TicketDetails.getInitialProps = async (context,client) => {
    const { ticketId } = context.query;
    const { data } = await client.get(`/api/tickets/${ticketId}`);
    return { ticket: data };
}
export default TicketDetails