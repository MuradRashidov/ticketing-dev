import { PaymentCreatedEvent, Publisher, Subjects } from "@test_comp/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}