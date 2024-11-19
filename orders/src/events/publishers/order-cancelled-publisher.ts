import { Subjects, Publisher, OrderCancelledEvent } from '@test_comp/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
