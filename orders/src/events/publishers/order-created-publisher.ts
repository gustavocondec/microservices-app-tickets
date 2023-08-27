import { type OrderCreatedEvent, PublisherBase, Subjects } from '@gc-tickets/common'

export class OrderCreatedPublisher extends PublisherBase<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
}
