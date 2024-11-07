import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('return 404  when ticket not found', async () => {
    const id =new  mongoose.Types.ObjectId().toHexString()
    await request(app).get(`/api/tickets/${id}`).send().expect(404);
});
it('return tiket  when ticket is found', async () => {
    const title = "asdfg";
    const price = 10;
    const res = await request(app)
                      .post('/api/tickets')
                      .set({cookie: global.signin()})
                      .send({title,price})
                      .expect(201);
                  
     const getRes =   await request(app)
                      .get(`/api/tickets/${res.body.id}`)
                      .send()
                      .expect(200)
    expect(getRes.body.title).toEqual(title);
    expect(getRes.body.price).toEqual(price);

});