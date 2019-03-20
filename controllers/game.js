
module.exports = (io) => {
  const Lobby = require('../models/Lobby')
  const User = require('../models/user')

  io.on('connection', (client) => {

    client.on('Create Lobby', (sets, strId, owner) => {
      Lobby.create({ users: [], strId, sets , gameState: 'Idle', owner})
        .then(lobby => {
          lobby.save()
            .then(() => {
              client.emit("Lobby Created", lobby._id)
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    })

    client.on('Join Lobby', (lobbyId, user) => {
      client.join(lobbyId)
      Lobby.findById(lobbyId)
        .then(lobby => {
          let owner = false
          if(lobby.owner === user._id) {
            owner = true
          }

          if (!lobby.users.reduce((count, userCheck) => userCheck.id === user._id, 0)) {
            lobby.users.push({ name: user.name, id: user._id, points: 0, czar: false, owner })
          }
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