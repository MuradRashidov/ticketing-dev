import { ExpirationCompleteEvent, Listener, OrderStatus, Subjects } from "@test_comp/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCreatedPublisher } from "../publishers/order-created-publisher";
import { natsWrapper } from "../../nats-wrapper";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { queueGroupName } from "./queue-group-name";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    queueGroupName: string =  queueGroupName;
    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId).populate('ticket');
        if(!order) throw new Error('Order Not Found');
        if (order.status === OrderStatus.Complete) {
            return msg.ack();
        }
        order.set({
            status: OrderStatus.Cancelled
        });
        order.set({status: OrderStatus.Cancelled});
        await order.save();
        console.log('Order: ',order.version)
       try {
        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: { id: order.ticket.id }
        });
       } catch (error) {
        console.log(error);
        
       }
        msg.ack();
    }
}