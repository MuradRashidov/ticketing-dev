import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
  var signin: () => string;
}


// After declaring it, assign the function to `global.signin` somewhere in your setup code:


let mongo:any;
beforeAll(async () => {
    process.env.JWT_KEY = 'asdf'

    mongo = await MongoMemoryServer.create(); 
    const mongoUri = mongo.getUri();          
    await mongoose.connect(mongoUri, {});   
});

beforeEach(async () => {
    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.collections();
   
      for (let collection of collections) {
        await collection.deleteMany({});
      }
    }
  });

  afterAll(async () => {
    if (mongo) {
      await mongo.stop();
    }
    await mongoose.connection.close();
  });

global.signin = () => {
  const payload = { id:"1qw23er45t6y7ui99o98uu5", email:"test@gmail.com" };
  const token = jwt.sign(payload,process.env.JWT_KEY!);
  const session = JSON.stringify({jwt:token});
  const base64 = Buffer.from(session).toString('base64');
  return `session=${base64}`; 
}