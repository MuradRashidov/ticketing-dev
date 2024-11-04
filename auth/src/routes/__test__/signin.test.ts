import request from 'supertest';
import { app } from "../../app";

it('fail when entered email which does not exist', async () => {
    await request(app)
          .post('/api/users/signin')
          .send({
            email:"notexist@gmail.com",
            password:"1234567"
          })
          .expect(500);
});

it('fail when entered incorrect password', async () => {
    await request(app)
          .post('/api/users/signup')
          .send({
            email:"mrdrshdov@gmail.com",
            password:"asdfghj"
          })
          .expect(201);
    await request(app)
          .post('/api/users/signin')
          .send({
            email:"mrdrshdov@gmail.com",
            password:"vbnmlkh"
          })
          .expect(500);
});

it('responds with a cokie when given valid credentials', async () => {
    await request(app)
   .post('/api/users/signup')
   .send({
    email:"mrdsdv@gmail.com",
    password: "jjkjkhkjh"
   })
   .expect(201);

     const response = await request(app)
         .post('/api/users/signin')
         .send({
            email:"mrdsdv@gmail.com",
            password: "jjkjkhkjh"
          })
          .expect(200);
          
          
          expect(response.get('Set-Cookie')).toBeDefined();
})