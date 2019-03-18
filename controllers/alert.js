
module.exports = (io) => {
  
  io.on('connection', (client) => {

    client.on('alert', () => {
      io.emit('newAlert')
    })

  })


}