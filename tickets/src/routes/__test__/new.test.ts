import request from "supertest";
import {app} from '../../app';
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";
it('has a route handler listening to /api/tickets fro post requests', async () => {
   const res = await request(app).post('/api/tickets').send({});
   expect(res.status).not.toEqual(404)
});
it('check only access user is signed in', async () => {
    const res = await request(app).post('/api/tickets').send({});
    expect(res.status).toEqual(401);
});
it('return  other status than 401 if user is signed in', async () => {
    const res = await request(app)
                      .post('/api/tickets')
                      .set({cookie:global.signin()})
                      .send({});
    expect(res.status).not.toEqual(401)
                      
});
it('return error invalid title is provided', async () => {
           await request(app)
                .post('/api/tickets')
                .set({cookie:global.signin()})
                .send({
                    title:'',
                    price:10
                })
                .expect(400);
           await request(app)
                .post('/api/tickets')
                .set({cookie:global.signin()})
                .send({
                    price:10
                })
                .expect(400);
        
});
it('return error invalid price is provided', async () => {
           await request(app)
                .post('/api/tickets')
                .set({cookie:global.signin()})
                .send({
                    title:'cdsaf',
                    price:-10
                })
                .expect(400);
           await request(app)
                .post('/api/tickets')
                .set({cookie:global.signin()})
                .send({
                    title:"dsfdsklfsd"
                })
                .expect(400);
});
it('return error invalid input is provided', async () => {
    let ticketCount = (await Ticket.find({})).length;
    expect(ticketCount).toEqual(0);
           await request(app)
                    .post('/api/tickets')
                    .set({cookie:global.signin()})
                    .send({
                           title:"dsfdsklfsd",
                           price:20
                          })
                     .expect(201);
     ticketCount = (await Ticket.find({})).length;
     expect(ticketCount).toEqual(1);                 
       
});
it('check event is published', async () => {
    let ticketCount = (await Ticket.find({})).length;
    expect(ticketCount).toEqual(0);
           await request(app)
                    .post('/api/tickets')
                    .set({cookie:global.signin()})
                    .send({
                           title:"dsfdsklfsd",
                           price:20
                          })
                     .expect(201);
     ticketCount = (await Ticket.find({})).length;
     expect(ticketCount).toEqual(1);  
     expect(natsWrapper.client.publish).toHaveBeenCalled();               
       
});
