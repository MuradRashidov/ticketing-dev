import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";
import  request  from "supertest";
import { app } from "../../app";


const createTicket = async () => {
    const ticket =  Ticket.build({
        title:"asdf",
        price:30,
        id:new mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();
    return ticket;
}
it('fetches order for an particular user',async () => {
    const ticketOne = await createTicket();
    const ticketTwo = await createTicket();
    const ticketThree = await createTicket();

    const userOne = global.signin();
    const userTwo = global.signin();

    const { body: orderOne } = await request(app)
    .post('/api/orders').set('Cookie',userOne).send({ticketId:ticketOne.id}).expect(201);
    

    const { body: orderTwo } = await request(app)
    .post('/api/orders').set('Cookie',userTwo).send({ticketId:ticketTwo.id}).expect(201);
    
    const { body: orderThree } = await request(app)
    .post('/api/orders').set('Cookie',userTwo).send({ticketId:ticketThree.id}).expect(201);
    
    const response = await request(app).get('/api/orders').set('Cookie',userTwo)
    .expect(200);
    
     expect(response.body.length).toEqual(2);
     expect(response.body[0].id).toEqual(orderTwo.id)
     expect(response.body[1].id).toEqual(orderThree.id)
     expect(response.body[0].ticket.id).toEqual(ticketTwo.id)
     expect(response.body[1].ticket.id).toEqual(ticketThree.id)
    
});