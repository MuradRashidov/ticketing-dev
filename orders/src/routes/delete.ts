import express, { Request, Response }from 'express';

const rooter = express.Router();
rooter.delete('/api/orders/:orderId', async (req: Request, res:Response) => {
    res.send({});
})

export { rooter as deleteOrderRouter }