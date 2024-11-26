import { OrderCreatedEvent, OrderStatus } from "@test_comp/common";
import { Ticket } from "../../../models/ticket"
import mongoose from "mongoose";
import { OrderCreatedListener } from "../order-created-listener";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../../nats-wrapper";

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const ticket = await Ticket.build({
        price: 20,
        title: 'asd',
        userId: 'asdf'
    });

    await ticket.save();

    const data:OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'asddff',
        expiresAt: 'asdadf',
        ticket: {
            id: ticket.id,
            price: ticket.price,
        }
    }
    //@ts-ignore
    const msg:Message = {
        ack: jest.fn()
    }
    return { listener, ticket, data, msg };
}

it('set userId of ticket', async () => {
    const { listener, data, ticket, msg } = await setup();
    await listener.onMessage(data,msg);
    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket?.orderId).toEqual(data.id);
});
it('call msg acks', async () => {
    const { listener, data, ticket, msg } = await setup();
    await listener.onMessage(data,msg);
    expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
   const { data, listener, msg, ticket } = await setup();
   await listener.onMessage(data,msg);
   expect(natsWrapper.client.publish).toHaveBeenCalled();
   const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock)
                            .mock.calls[0][1]);
   expect(data.id).toEqual(ticketUpdatedData.orderId);
});