import { Listener, OrderCancelledEvent, Subjects } from "@test_comp/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
   subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
   queueGroupName: string = this.queueGroupName;
   async onMessage(data: OrderCancelledEvent['data'], msg: Message): Promise<void> {
       const ticket = await Ticket.findById(data.ticket.id);
       if(!ticket) throw new Error('This ticket does not exist');
       ticket.set({orderId:undefined});
       await ticket.save();
       await new TicketUpdatedPublisher(this.client).publish({
        ...ticket,id:ticket.id
       });
       msg.ack();
   }
}