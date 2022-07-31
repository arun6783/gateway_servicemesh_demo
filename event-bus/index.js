// const express = require('express')
// const bodyParser = require('body-parser')
// const axios = require('axios')

// const app = express()
// app.use(bodyParser.json())

// const events = []

// app.post('/events', (req, res) => {
//   const event = req.body

//   events.push(event)

//   // let commentsServiceHost = process.env.COMMENTS_SRV_HOST || 'localhost'
//   //let queryServiceHost = process.env.QUERY_SRV_HOST || 'localhost'
//   //let moderationServiceHost = process.env.MODERATION_SRV_HOST || 'localhost'

//   // axios
//   //   .post(`http://${commentsServiceHost}:4001/events`, event)
//   //   .catch((err) => {
//   //     console.log(`http://${commentsServiceHost}:4001/events` + err.message)
//   //   })
//   // axios.post(`http://${queryServiceHost}:4002/events`, event).catch((err) => {
//   //   console.log(`http://${queryServiceHost}:4002/events` + err.message)
//   // })
//   // axios
//   //   .post(`http://${moderationServiceHost}:4004/events`, event)
//   //   .catch((err) => {
//   //     console.log(`http://${moderationServiceHost}:4004/events` + err.message)
//   //   })
//   res.send({ status: 'OK' })
// })

// app.get('/events', (req, res) => {
//   res.send(events)
// })

// app.listen(4005, () => {
//   console.log('Listening on 4005')
// })
