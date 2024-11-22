import mongoose from "mongoose"
import { Order } from "./order";
import { OrderStatus } from "@test_comp/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
    id: string;
    title: string;
    price: number;
}
export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved():Promise<boolean>;
}

interface TicketModel extends  mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs):TicketDoc;
    findByEvent(event: { id:string, version: number }):Promise<TicketDoc | null>;
};

const ticketSchema = new mongoose.Schema({
    title: { type: String, require:true},
    price: { type: Number, require:true, min:0},
},{
    toJSON:{
        transform:(doc,ret:any) => {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.set('versionKey','version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByEvent = async (event: { id:string, version: number }) => {
    return Ticket.findOne({_id:event.id, version: event.version - 1});
}
ticketSchema.statics.build = (attrs:TicketAttrs) => {
    return new Ticket({ _id: attrs.id, price: attrs.price, title: attrs.title })
}
ticketSchema.methods.isReserved = async function() {
    const existingOrder = await Order.findOne({
        ticket:this,
        status:{$in:[OrderStatus.AwaitingPayment,OrderStatus.Created,OrderStatus.Complete]}});

        return !!existingOrder;
}

const Ticket = mongoose.model<TicketDoc,TicketModel>("Ticket",ticketSchema);
export { Ticket };