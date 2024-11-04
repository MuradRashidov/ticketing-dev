import request from 'supertest';
import { app } from "../../app";

it('returns a 201 an successfull signup', async () => {
    return request(app)
           .post('/api/users/signup')
           .send({
              email:"mrsdv@gmail.com",
              password: "asdfghj"
           })
           .expect(201);
});

it('returns a 400 with an individual email', async () => {
    return request(app)
           .post('/api/users/signup')
           .send({
              email:"asdsakdjkasjd",
              password: "asdfghj"
           })
           .expect(400);
});

it('returns a 400 with an invalid password', async () => {
    return request(app)
           .post('/api/users/signup')
           .send({
              email:"asdsakdjkasjd",
              password: ""
           })
           .expect(400);
});

it('returns a 400 with missing email and password', async () => {
    await request(app)
           .post('/api/users/signup')
           .send({
            email:"mrsdv@gmail.com",

            password: ""
           })
           .expect(400);
    await request(app)
           .post('/api/users/signup')
           .send({
              email:"asdsakdjkasjd",
              password: ""
           })
           .expect(400);
});

it('Disallow duplicate email', async () => {
    await request(app)
           .post('/api/users/signup')
           .send({
            email:"mrdsdv@gmail.com",
            password: "jjkjkhkjh"
           })
           .expect(201);
    await request(app)
           .post('/api/users/signup')
           .send({
              email:"mrdsdv@gmail.com",
              password: ""
           })
           .expect(400);
});

it('sets a cookie after successful signup', async () => {;
  const responce =  await request(app)
   .post('/api/users/signup')
   .send({
    email:"mrdsdv@gmail.com",
    password: "jjkjkhkjh"
   })
   .expect(201);
   expect(responce.get('Set-Cookie')).toBeDefined();
});
