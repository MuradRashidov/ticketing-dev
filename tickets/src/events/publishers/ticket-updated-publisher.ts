import { Publisher, Subjects, TicketUpdatedEvent } from "@test_comp/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}