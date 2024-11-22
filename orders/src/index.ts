import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-update-listener";

const start = async () => {
    if(!process.env.JWT_KEY) throw new Error("JWT must be defined");
    if(!process.env.MONGO_URI) throw new Error("JWT must be defined");

    if(!process.env.NATS_CLIENT_ID) throw new Error("NATS_CLIENT_ID must be defined");
    if(!process.env.NATS_URL) throw new Error("NATS_URL must be defined");
    if(!process.env.NATS_CLUSTER_ID) throw new Error("NATS_CLUSTER_ID must be defined");
    try {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID,process.env.NATS_CLIENT_ID,process.env.NATS_URL);
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();
        });
        process.on('SIGINT', () => {
            console.log('SIGINT received, closing NATS connection...');
            natsWrapper.client.close();
        });
        
        process.on('SIGTERM',() => {
            console.log('SIGTERM received, closing NATS connection...');
            natsWrapper.client.close();
        });
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to mongodb');

        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();
        
    } catch (error) {
        console.log(error);
    }
    app.listen(3000, () => {
        console.log("Tickets service is running http://localhost:3000!")
    });
}
start();