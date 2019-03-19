
module.exports = (io) => {
  const Lobby = require('../models/Lobby')
  const User = require('../models/user')

  io.on('connection', (client) => {

    client.on('Create Lobby', (sets, strId) => {
      console.log(strId)
      Lobby.create({ users: [], strId, sets })
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
      console.log(user)
      client.join(lobbyId)
      Lobby.findById(lobbyId)
        .then(lobby => {
          lobby.users.push({ name: user.name, id: user._id, points: 0 })
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