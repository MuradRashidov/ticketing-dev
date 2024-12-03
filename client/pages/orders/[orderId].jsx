import React, { useEffect, useState } from 'react'
import StripeCheckout  from 'react-stripe-checkout'
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const OrderDetails = ({order,currentUser}) => {
    const [leftTime,setLeftTime] = useState('');
    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - Date.now();
            setLeftTime(Math.round(msLeft/1000))
        }        
       const timerId =  setInterval(findTimeLeft,1000);
       return () => {
        clearInterval(timerId)
       }
    },[order]);
    if (leftTime < 0) {
        return <div>Order expired</div>
    }
    const { doRequest, errors } = useRequest({
        url:'/api/payments',
        method:'post',
        body: {
            orderId: order.id
        },
        onSuccess:(payment => Router.push('/orders') )
        
    });
  return (
    <div>
        After {leftTime} second order will expire 
        <div>
            <StripeCheckout
                token={({id})=> doRequest({token:id})}
                stripeKey='pk_test_51OltgyESex0jeEaydyYu9mvNmly48G3cEctXdF0WaxwWy0G2xxJULDA6FJe37kkJzjQcumeHmKIMXBBxZP0BLk8W00GjiAYLbE'
                amount={order?.ticket?.price*100}
                email={currentUser?.email}
            />
        </div>
        {errors}
    </div>
  )
}
OrderDetails.getInitialProps = async (context,client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);
    return { order: data }
}
export default OrderDetails