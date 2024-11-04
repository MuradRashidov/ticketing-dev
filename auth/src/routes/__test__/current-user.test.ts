import request from 'supertest';
import { app } from "../../app";

it('get details about current user', async () => {
    const cookie = await global.signin();
    
    const responce = await request(app)
                           .get('/api/users/currentuser')
                           .set('Cookie',cookie)
                           .send()
                           .expect(200)
                           console.log('Helper: ');
                           
                           expect(responce.body.currentUser.email).toEqual('test@gmail.com');
                           
});

it('Check if not signed in current user equal to null', async () => {
      const response = await request(app)
                       .get('/api/users/currentuser')
                       .send()
                       .expect(200);

                       expect(response.body.currentUser).toEqual(null)
                       
});