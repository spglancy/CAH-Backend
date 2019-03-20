
module.exports = (io) => {
  const Lobby = require('../models/Lobby')
  const User = require('../models/user')

  io.on('connection', (client) => {

    client.on('Create Lobby', (sets, strId, owner) => {
      Lobby.create({ users: [], strId, sets, gameState: 'Idle', owner, currBlack: null, playedWhite: null })
        .then(lobby => {
          for (let i = 0; i < lobby.sets.length; i++) {
            lobby.blackCards = lobby.blackCards.concat(sets[i].blackCards)
            lobby.whiteCards = lobby.whiteCards.concat(sets[i].whiteCards)
          }
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
          if (lobby.owner === user._id) {
            owner = true
          }
          
          if (!(lobby.users.reduce((me, userCheck) => {
            console.log(userCheck.id, user._id, me)
            if(userCheck.id === user._id) {
              return(userCheck)
            } else {
              return me
            }
          }, null))) {
            let cards = []
            for (let i = 0; i < 10; i++) {
              cards.push(lobby.whiteCards.pop(Math.floor(Math.random() * lobby.whiteCards.length)))
            }
            lobby.users.push({ name: user.name, id: user._id, points: 0, czar: false, owner, cards })
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