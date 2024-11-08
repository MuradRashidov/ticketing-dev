import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';

it('return 404 if provided id is does not exist', async () => {
     const id =new mongoose.Types.ObjectId().toHexString();
     await request(app)
           .put(`/api/tickets/${id}`)
           .set('Cookie',global.signin())
           .send({title:"asd",price:10})
           .expect(404);
});

it('return 401 if user is not authorizated', async () => {

const id =new mongoose.Types.ObjectId().toHexString();
     await request(app)
           .put(`/api/tickets/${id}`)
           .send({title:"asd",price:10})
           .expect(401);
});

it('eturn 401 if user is not own the ticket', async () => {
    const res =   await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({
           title:"dsfdsklfsd",
           price:20
          })
     .expect(201);
const id = res.body.id;
await request(app)
.put(`/api/tickets/${id}`)
.set('Cookie',global.signin())
.send({title:"asd",price:10})
.expect(401);
});

it('eturn 400 if user is not provides invalid inputs', async () => {
    const cookie = global.signin()
    const res =   await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
           title:"dsfdsklfsd",
           price:20
          })
     .expect(201);
    const id = res.body.id;
    await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie',cookie)
    .send({title:"",price:10})
    .expect(400);
    await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie',cookie)
    .send({title:"klkl",price:-10})
    .expect(400);
});

it('update ticket with valid input', async () => {
    const cookie = global.signin()
    const res =   await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
           title:"dsfdsklfsd",
           price:20
          })
     .expect(201);
    const id = res.body.id;
    await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie',cookie)
    .send({title:"asdf",price:10})
    .expect(200);
    
    const updatedTicket = await request(app)
    .get(`/api/tickets/${id}`).send();

    expect(updatedTicket.body.title).toEqual('asdf')
    expect(updatedTicket.body.price).toEqual(10)
    
});