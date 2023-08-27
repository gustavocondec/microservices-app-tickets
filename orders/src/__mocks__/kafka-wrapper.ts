import { type Subjects } from '@gc-tickets/common'

const prod = { // queda como contante para evitar que se intancie cada vez que se llama
  connect: () => {
  },
  send: jest.fn().mockImplementation((record: { topic: Subjects, messages: object[] }) => {})
}
export const kafkaWrapper = {
  client: {
    producer: jest.fn().mockImplementation(() => {
      return prod
    }),
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback()
        }
      )
  }
}
