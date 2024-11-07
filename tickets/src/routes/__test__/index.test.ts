import request from 'supertest';
import { app } from '../../app';

const createTicket = () => {
    const title = "dsffd";
    const price = 10;
                return request(app)
                      .post('/api/tickets')
                      .set({cookie: global.signin()})
                      .send({title,price})
                      .expect(201);
}

it('get all tickets', async () => {
    await createTicket();
    await createTicket();
    await createTicket();

    const res = await request(app).get('/api/tickets').send().expect(200);
    expect(res.body.length).toEqual(3);
});