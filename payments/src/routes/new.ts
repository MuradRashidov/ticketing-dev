import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, ValidateRequest } from "@test_comp/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-listener";
import { natsWrapper } from "../nats-wrapper";

const router = Router();
router.post('/api/payments',requireAuth, [
    body('token').not().isEmpty(),
    body('orderId').not().isEmpty()
], ValidateRequest, async (req:Request,res:Response) => {

    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);

    if(!order) throw new NotFoundError();
    console.log(`Order:   ${order}`);
    
    if(order.userId !== req.currentUser?.id) throw new NotAuthorizedError();
    if(order.status === OrderStatus.Cancelled) throw new BadRequestError('Can not pay an cancelled order');
    try {
      const charge = await stripe.charges.create({
            amount: order.price * 100,
            currency: 'usd',
            source: token
        });
      const payment = Payment.build({
        orderId,
        stripeId: charge.id
      });
      await payment.save();
      new PaymentCreatedPublisher(natsWrapper.client)
      .publish({ id: payment.id, orderId: payment.orderId, stripeId: payment.stripeId });
      res.status(201).send({ paymentId: payment.id });

    } catch (error) {
        console.log('msg: ',error);
    }
});
export { router as createChargeRoute };