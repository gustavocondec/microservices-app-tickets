import { Kafka } from 'kafkajs'

class KafkaWrapper {
  private _client?: Kafka
  constructor () {
    console.log('se instancia kafka wrapper')
  }

  get client (): Kafka {
    if (this._client == null) throw new Error('Cannot access Kafka client before connecting')
    return this._client
  }

  async connect (url: string): Promise<void> {
    this._client = new Kafka({ brokers: [url], clientId: 'sas', connectionTimeout: 30000 })
    await this._client.producer().connect() // To test connect
    console.log('Connected to Kafka')
  }
}

export const kafkaWrapper = new KafkaWrapper()
