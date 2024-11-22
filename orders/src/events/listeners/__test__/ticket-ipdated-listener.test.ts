import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { TicketUpdatedEvent } from "@test_comp/common";
import { Message } from "node-nats-streaming";
import { TicketUpdatedListener } from "../ticket-update-listener";
import { natsWrapper } from "../../../nats-wrapper";

const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client);
    const ticket =  Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        price:20,
        title:'asd'
    });

    await ticket.save();

    const data:TicketUpdatedEvent['data'] = {
        id: ticket.id,
        title: 'test',
        price: 30,
        version: ticket.version + 1,
        userId:'edewdefwefdsfsf'
    }
// @ts-ignore
    const msg: Message = {
        ack:jest.fn()
    }

    return { listener, ticket, data, msg }
};

it('finds, updates and saves ticket', async () => {
    const { data, listener, msg, ticket } = await setup();
    await listener.onMessage(data, msg);
    
    const updatedTicket = await Ticket.findById(data.id);

    expect(updatedTicket?.title).toEqual('test');
    expect(updatedTicket?.price).toEqual(30);
});
it('acks  msg', async () => {
    const { data, listener, msg, ticket } = await setup();
    await listener.onMessage(data,msg);
    expect(msg.ack).toHaveBeenCalled();
});


