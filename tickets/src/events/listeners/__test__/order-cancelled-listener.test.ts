import { OrderCancelledEvent, OrderCreatedEvent, OrderStatus } from "@test_comp/common";
import { Ticket } from "../../../models/ticket"
import mongoose from "mongoose";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../../nats-wrapper";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const ticket = await Ticket.build({
        price: 20,
        title: 'asd',
        userId: 'asdf'
    });
    const orderId = new mongoose.Types.ObjectId().toHexString();
    ticket.set({orderId});
    await ticket.save();

    const data:OrderCancelledEvent['data'] = {
        id: orderId,
        version:1,
        ticket: {
            id: ticket.id
        }
    }
    //@ts-ignore
    const msg:Message = {
        ack: jest.fn()
    }
    return { listener, ticket, data, msg, orderId };
}

it('updates the ticket, publishing an  event and acks the message', async () => {
    const { listener, ticket, data, msg, orderId } = await setup();
    await listener.onMessage(data,msg);

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket?.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled()
});