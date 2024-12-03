import mongoose from "mongoose";

interface PaymentAttrs {
    orderId: string;
    stripeId: string;
}
interface PaymentDoc extends mongoose.Document {
    orderId: string;
    stripeId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
    build(attrs:PaymentAttrs):PaymentDoc;
}

const paymentSechema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    stripeId: {
        type: String,
        required: true
    }
    
},{
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

paymentSechema.statics.build = (attrs: PaymentAttrs) => {
    return new Payment(attrs)
};

const Payment = mongoose.model<PaymentDoc,PaymentModel>('Payment',paymentSechema);
export { Payment }