import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";
import  request  from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { OrderStatus } from "@test_comp/common";
import { natsWrapper } from "../../nats-wrapper";


it('marks an order as cancelled', async () => {
    const ticket = Ticket.build({ title: 'asd', price: 20,id:new mongoose.Types.ObjectId().toHexString()});
    await ticket.save();
    const user = global.signin(); 
    const { body: order } = await request(app)
    .post('/api/orders').set('Cookie',user)
    .send({ ticketId: ticket.id }).expect(201);

    const { body: searchedOrder } = await request(app)
    .delete(`/api/orders/${order.id}`).set('Cookie',user).expect(204);
    const cancelledOrder = await Order.findById(order.id);
    expect(cancelledOrder?.status).toEqual(OrderStatus.Cancelled);

});

it('emits an order cancelled event', async () => {
    const ticket = Ticket.build({ title: 'asd', price: 20, id:new mongoose.Types.ObjectId().toHexString() });
    await ticket.save();
    const user = global.signin(); 
    const { body: order } = await request(app)
    .post('/api/orders').set('Cookie',user)
    .send({ ticketId: ticket.id }).expect(201);

    const { body: searchedOrder } = await request(app)
    .delete(`/api/orders/${order.id}`).set('Cookie',user).expect(204);
    const cancelledOrder = await Order.findById(order.id);
    expect(cancelledOrder?.status).toEqual(OrderStatus.Cancelled);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});