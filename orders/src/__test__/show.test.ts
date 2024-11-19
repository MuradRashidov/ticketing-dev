import request from "supertest";
import { Ticket } from "../models/ticket";
import { app } from "../app";
import { body } from "express-validator";

it('get order belong to current user', async () => {
    const ticket = Ticket.build({ title: 'asd', price: 20 });
    await ticket.save();
    const user = global.signin();
    const { body: order } = await request(app)
    .post('/api/orders').set('Cookie',user)
    .send({ ticketId: ticket.id }).expect(201);

    const { body: searchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`).set('Cookie',user).expect(200);

    expect(searchedOrder.id).toEqual(order.id);

});

it('error when request for one order by not author', async () => {
    const ticket = Ticket.build({ title: 'asd', price: 20 });
    await ticket.save();
    const user = global.signin();
    const { body: order } = await request(app)
    .post('/api/orders').set('Cookie',user)
    .send({ ticketId: ticket.id }).expect(201);

    const { body: searchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`).set('Cookie',global.signin()).expect(401);

});