let nats = require('node-nats-streaming')

class NatsWrapper {
  _client

  get client() {
    if (!this._client) {
      throw new Error(
        'commentsservice- Cannot access NATS client before connecting'
      )
    }

    return this._client
  }

  connect(clusterId, clientId, url) {
    this._client = nats.connect(clusterId, clientId, { url })

    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('commentsservice- Connected to NATS')
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
        console.log('commentsservice- Event published to subject', subject)
        resolve()
      })
    })
  }
}
exports.natsWrapper = new NatsWrapper()
