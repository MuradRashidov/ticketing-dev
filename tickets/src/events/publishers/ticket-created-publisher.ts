import { Publisher, Subjects, TicketCreatedEvent } from "@test_comp/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}