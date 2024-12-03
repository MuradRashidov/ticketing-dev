import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

jest.mock('../nats-wrapper');
//jest.mock('../stripe');

declare global {
  var signin: (id?: string) => string;
}


// After declaring it, assign the function to `global.signin` somewhere in your setup code:


let mongo:any;
process.env.STRIPE_SECRET_KEY = 'sk_test_51OltgyESex0jeEay012p1Uz1RPWdqmWFeNoRdgCLQfztBpTWAqeT0OcsJX3aQtRekOY5JW2RegGm2mDmTL2k12Xi0000S2sM2q'
beforeAll(async () => {
    process.env.JWT_KEY = 'asdf'

    mongo = await MongoMemoryServer.create(); 
    const mongoUri = mongo.getUri();          
    await mongoose.connect(mongoUri, {});   
});

beforeEach(async () => {
    jest.clearAllMocks();
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

global.signin = (id?: string) => {
  const payload = { 
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email:"test@gmail.com" };
  const token = jwt.sign(payload,process.env.JWT_KEY!);
  const session = JSON.stringify({jwt:token});
  const base64 = Buffer.from(session).toString('base64');
  return `session=${base64}`; 
}