const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
const ssl = require('./heroku-ssl')
const port = process.env.PORT


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(ssl())
//app.use(peerServer)
app.get('/', (req, res) => {
  res.render('home', { roomId: req.params.room })
})

app.get('/newroom', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
  console.log("creat room")
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)
    console.log("join-room")

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
      console.log("disconnect")
    })

    socket.on('send-reload', (roomId, all) => {
      socket.to(roomId).broadcast.emit('user-reload', userId)
      console.log("reload")
    })
    
    socket.on('send-notify', (roomId, all) => {
      socket.to(roomId).broadcast.emit('user-notify', userId)
      console.log("notify")
    })
  })
})

server.listen(port || 3000)