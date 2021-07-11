const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { randomBytes } = require('crypto')
const axios = require('axios')

const app = express()
const commentsByPostId = {}

app.use(bodyParser.json())
app.use(cors())

app.get('/posts/:id/comments', (req, res) => {
  const { id } = req.params
  res.send(commentsByPostId[id])
})

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex')
  const { content } = req.body

  const comments = commentsByPostId[req.params.id] || []

  comments.push({ id: commentId, content, status: 'pending' })
  commentsByPostId[req.params.id] = comments
  console.log('req.params', req.params)
  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: 'pending',
    }
  })

  res.status(201).send(comments)
})

app.post('/events', async (req, res) => {
  const { type, data } = req.body

  if (type === 'CommentModerated') {
    const { postId, id, status } = data
    const comments = commentsByPostId[postId] || []
    const comment = comments.find(comment => comment.id === id)

    comment.status = status

    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data,
    })
  }

  res.send({})
})

app.listen(4001, () => {
  console.log('listening comments 4001');
})
