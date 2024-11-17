import express, { Request, Response }from 'express';

const rooter = express.Router();
rooter.get('/api/orders', async (req: Request, res:Response) => {
    res.send({});
})

export { rooter as indexOrderRouter }