import { Publisher, OrderCreatedEvent, Subjects } from '@test_comp/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
