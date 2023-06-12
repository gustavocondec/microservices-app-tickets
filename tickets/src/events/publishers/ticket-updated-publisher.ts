import { PublisherBase, Subjects, type TicketUpdatedEvent } from '@gc-tickets/common'

export class TicketUpdatedPublisher extends PublisherBase<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}
