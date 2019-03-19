
module.exports = (io) => {
  const Lobby = require('../models/Lobby')

  io.on('connection', (client) => {

    client.on('Create Lobby', () => {
      Lobby.create({ users: [] })
        .then(lobby => {
          lobby.save()
            .then(() => {
              client.emit("Lobby Created", lobby._id)
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    })

    client.on('Join Lobby', (lobbyId, username) => {
      client.join(lobbyId)
      Lobby.findById(lobbyId)
        .then(lobby => {
          lobby.users.push({ name: username, points: 0, client: client.id })
          lobby.save()
            .then(lobby => {
              io.to(lobbyId).emit('Update Players', lobby.users)
            })
            .catch(err => console.log(err))

        })
    })

    client.on('Chat Message', (message, username, lobby) => {
      if (username) {

        io.to(lobby).emit('New Message', message, username)
      }
    })

  })


}