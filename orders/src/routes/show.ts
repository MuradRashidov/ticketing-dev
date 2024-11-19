import express, { Request, Response }from 'express';
import { Order } from '../models/order';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@test_comp/common';

const rooter = express.Router();
rooter.get('/api/orders/:orderId',requireAuth, async (req: Request, res:Response) => {

    const order = await Order.findById(req.params.orderId).populate('ticket');

    if(!order) throw new NotFoundError();

    if(order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    res.send(order);
})

export { rooter as showOrderRouter }