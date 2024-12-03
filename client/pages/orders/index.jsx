import React from 'react'

const OrderList = ({orders}) => {
  return (
    <div>
        <div>efwf</div>
        {
            orders.map((order) => (
                <div>
                {order.ticket.title}-{order.status}
                </div>
            ))
        }
    </div>
  )
}
OrderList.getInitialProps = async (context,client) => {
    const { data } = await client.get('/api/orders');
    return { orders: data }
}
export default OrderList