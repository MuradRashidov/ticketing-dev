import { requireAuth } from '@test_comp/common';
import express, { Request, Response }from 'express';
import { Order } from '../models/order';

const rooter = express.Router();
rooter.get('/api/orders', requireAuth,async (req: Request, res:Response) => {    
    const orders = await Order.find({ userId: req.currentUser!.id }).populate('ticket');
    res.send(orders);
    console.log("My Orders",orders);
    
})

export { rooter as indexOrderRouter }