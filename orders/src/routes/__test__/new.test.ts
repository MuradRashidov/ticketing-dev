import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";
import  request  from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { OrderStatus } from "@test_comp/common";
import { natsWrapper } from "../../nats-wrapper";

it('return an arror if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId();
  await request(app)
        .post('/api/orders')
        .set('Cookie',global.signin())
        .send({ticketId})
        expect(404);
});
it('return an arror if the ticket already reserved', async () => {
    const ticket = Ticket.build({
        title:'horse rice',
        price: 50,
        id:new mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();

    const order = Order.build({
        ticket,
        expiresAt: new Date(),
        userId: 'kfsdkfdslfskfslkf',
        status: OrderStatus.Created 
    });
    await order.save();
    await  request(app)
          .post('/api/orders')
          .set('Cookie',global.signin())
          .send({ticketId:ticket.id})
          .expect(500);
});
it('reserve a ticket', async () => {
    const ticket = Ticket.build({
        title:'horse rice',
        price: 50,
        id:new mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();

    await  request(app)
          .post('/api/orders')
          .set('Cookie',global.signin())
          .send({ticketId:ticket.id})
          .expect(201);
});

it('emits an order creating event', async () => {
    const ticket = Ticket.build({
        title:'horse rice',
        price: 50,
        id:new mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();

    await  request(app)
          .post('/api/orders')
          .set('Cookie',global.signin())
          .send({ticketId:ticket.id})
          .expect(201);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});