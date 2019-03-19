
module.exports = (io) => {
  
  io.on('connection', (client) => {

    client.on('chatMessage', (message) => {
      io.emit('newMessage', message)
    })

  })

}