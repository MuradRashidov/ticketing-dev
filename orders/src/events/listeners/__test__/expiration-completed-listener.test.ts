import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener"
import { Order } from "../../../models/order";
import { ExpirationCompleteEvent, OrderStatus } from "@test_comp/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listener = await new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 10,
        title: "asdf"
    });
    await ticket.save();
    const order = Order.build({
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date(),
        status: OrderStatus.Created,
        ticket
    });
    await order.save();
    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    };

    // @ts-ignore
     const msg: Message = {
        ack: jest.fn()
     }

     return { listener, ticket, order, data, msg }
}

it('updates the order status to cancelled', async () => { 
    const { listener, ticket, order, data, msg } = await setup();
    await listener.onMessage(data,msg);
    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
});
it('emit an order cancelled event event', async () => { 
    const { listener, ticket, order, data, msg } = await setup();
    await listener.onMessage(data,msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
    
    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(eventData.id).toEqual(order.id);
});
it('ack the message', async () => { 
    const { listener, ticket, order, data, msg } = await setup();
    await listener.onMessage(data,msg);
    expect(msg.ack).toHaveBeenCalled();
});