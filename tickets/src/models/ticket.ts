import mongoose from "mongoose"
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
}
interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    version:number;
}

interface TicketModel extends  mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs):TicketDoc;
};

const ticketSchema = new mongoose.Schema({
    title: String,
    price: Number,
    userId: String
},{
    toJSON:{
        transform:(doc,ret:any) => {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.statics.build = (attrs:TicketAttrs) => {
    return new Ticket(attrs)
}
ticketSchema.set('versionKey','version');
ticketSchema.plugin(updateIfCurrentPlugin);
const Ticket = mongoose.model<TicketDoc,TicketModel>("Ticket",ticketSchema);
export { Ticket };