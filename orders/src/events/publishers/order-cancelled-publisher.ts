import { type OrderCancelledEvent, PublisherBase, Subjects } from '@gc-tickets/common'

export class OrderCancelledPublisher extends PublisherBase<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}
