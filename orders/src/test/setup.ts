import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';
import { Order } from '../models/order';

jest.mock('../nats-wrapper');

declare global {
  var signin: (id?:string) => string;
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
    jest.clearAllMocks();
    const ordersLength = await Order.find();    
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
  const payload = { 
    id:new mongoose.Types.ObjectId().toHexString(),
    email:"test@gmail.com" };
  const token = jwt.sign(payload,process.env.JWT_KEY!);
  const session = JSON.stringify({jwt:token});
  const base64 = Buffer.from(session).toString('base64');
  return `session=${base64}`; 
}