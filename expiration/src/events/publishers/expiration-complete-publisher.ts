import { ExpirationCompleteEvent, Publisher, Subjects } from "@test_comp/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}