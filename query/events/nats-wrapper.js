let nats = require('node-nats-streaming')
class NatsWrapper {
  _client

  get client() {
    if (!this._client) {
      throw new Error(
        'QueryService- Cannot access NATS client before connecting'
      )
    }

    return this._client
  }

  connect(clusterId, clientId, url) {
    this._client = nats.connect(clusterId, clientId, { url })

    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('QueryService- Connected to NATS')
        resolve()
      })
      this.client.on('error', (err) => {
        reject(err)
      })
    })
  }

  publish(subject, data) {
    return new Promise((resolve, reject) => {
      this._client.publish(subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err)
        }
        console.log('QueryService- Event published to subject', subject)
        resolve()
      })
    })
  }
  _subscriptionOptions(queueGroupName) {
    const ackWait = 5 * 1000
    return this._client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(ackWait)
      .setDurableName(queueGroupName)
  }

  listen(subject, queueGroupName, onMessage) {
    const subscription = this._client.subscribe(
      subject,
      queueGroupName,
      this._subscriptionOptions(queueGroupName)
    )
    subscription.on('message', (msg) => {
      console.log(
        `QueryService - Message received: ${subject} / ${queueGroupName}`
      )
      console.log('QueryService-data=', msg.getData())
      const parsedData = JSON.parse(msg.getData())
      onMessage(subject, parsedData)
      msg.ack()
    })
  }
}

exports.natsWrapper = new NatsWrapper()
