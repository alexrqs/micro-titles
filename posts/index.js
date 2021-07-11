const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors')
const axios = require('axios')

const posts = {}
const app = express();

app.use(cors())
app.use(bodyParser.json())

app.get('/posts', (req, res) => {
  res.send(posts)
})

app.post('/posts/create', async (req, res) => {
  const { title } = req.body
  const id = randomBytes(4).toString('hex')
  posts[id] = {
    id,
    title,
  }

  await axios.post('http://event-bus-srv:4005/events', {
    type: 'PostCreated',
    data: {
      id, title,
    }
  })

  res.status(201).send(posts[id])
})

app.post('/events', (req, res) => {
  console.log('Event received', req.body.type)

  res.send({})
})

app.listen(4000, () => {
  console.log('listening 4000');
})
