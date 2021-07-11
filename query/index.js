const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const axios = require('axios')

const app = express()
const posts = {}

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data
    posts[id] = { id, title, comments: []}
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data
    posts[postId].comments.push({ id, content, status })
  }

  if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data

    const post = posts[postId]
    const comment = post.comments.find(comment => comment.id === id)

    comment.status = status
    comment.content = content
  }
}

app.use(bodyParser.json())
app.use(cors())

app.get('/posts', (req, res) => {
  res.send(posts)
})

app.post('/events', (req, res) => {
  const { type, data } = req.body

  handleEvent(type, data);

  res.send({})
})

app.listen(4002, async () => {
  console.log('listening 4002')

  const res = await axios.get('http://event-bus-srv:4005/events')

  for (const event of res.data) {
    handleEvent(event.type, event.data)
  }
})
