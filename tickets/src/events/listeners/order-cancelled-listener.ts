import { Listener, OrderCancelledEvent, Subjects } from "@test_comp/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
   subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
   queueGroupName: string = 'tickets-service';
   async onMessage(data: OrderCancelledEvent['data'], msg: Message): Promise<void> {
       const ticket = await Ticket.findById(data.ticket.id);
       if(!ticket) throw new Error('This ticket does not exist');
       ticket.set({orderId:undefined});
       await ticket.save();
       console.log("Ticket:   ",ticket);
       
       await new TicketUpdatedPublisher(this.client).publish({
        id: ticket.id,
        price: ticket.price,
        title: ticket.title,
        userId: ticket.userId,
        version: ticket.version,
        orderId: ticket.orderId
       });
       msg.ack();
   }
}