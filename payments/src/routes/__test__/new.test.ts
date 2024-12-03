import  request  from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@test_comp/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";
//jest.mock('../../stripe.ts')
it('throw error when order not found', async () => {
    await request(app)
          .post('/api/payments')
          .set('Cookie',global.signin())
          .send({
            token: "asdfg",
            orderId: new mongoose.Types.ObjectId().toHexString()
          })
          .expect(404)
});

it('throw error when userId does not matches', async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 20,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0
    });
    await order.save();
    await request(app)
          .post('/api/payments')
          .set('Cookie',global.signin())
          .send({
            token: "asdfg",
            orderId: order.id
          })
          .expect(401)
});

it('throw error when order status is cancelled', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 20,
        status: OrderStatus.Cancelled,
        userId,
        version: 0
    });
    await order.save();
    await request(app)
          .post('/api/payments')
          .set('Cookie',global.signin(userId))
          .send({
            token: "asdfg",
            orderId: order.id
          })
          .expect(500)
});

it('returns 204 with valid inputs', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const amount = Math.floor(Math.random()*1000000);
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        price: amount,
        status: OrderStatus.Created,
        userId,
        version: 0
    });
    await order.save();
    await request(app)
          .post('/api/payments')
          .set('Cookie',global.signin(userId))
          .send({
            token: "tok_visa",
            orderId: order.id
          }).expect(201)
          
        const stripeCharges = await stripe.charges.list({limit:50});
        const stripeCharge = stripeCharges.data.find((c) => {return c.amount === amount*100});
        expect(stripeCharge).toBeDefined();
        expect(stripeCharge?.currency).toEqual('usd');
        const payment = Payment.build({ orderId: order.id, stripeId: stripeCharge!.id });
        expect(payment).not.toBeNull();
          
});


