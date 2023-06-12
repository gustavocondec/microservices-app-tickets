import { PublisherBase, Subjects, type TicketCreatedEvent } from '@gc-tickets/common'

export class TicketCreatedPublisher extends PublisherBase<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
}
