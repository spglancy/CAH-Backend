
module.exports = (io) => {
  const Lobby = require('../models/Lobby')
  const User = require('../models/user')

  io.on('connection', (client) => {

    client.on('Create Lobby', (sets, strId, owner) => {
      Lobby.create({ users: [], strId, sets, gameState: 'Idle', owner, currBlack: null, playedWhite: [], czar: '' })
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
            if (userCheck.id === user._id) {
              return (userCheck)
            } else {
              return me
            }
          }, null))) {
            let cards = []
            for (let i = 0; i < 10; i++) {
              cards.push(lobby.whiteCards.splice(Math.floor(Math.random() * lobby.whiteCards.length), 1)[0])
            }
            lobby.users.push({ name: user.name, id: user._id, points: 0, czar: false, owner, cards, played: false})
          }
          lobby.save()
            .then(lobby => {
              io.to(lobbyId).emit('Update Players', lobby)
            })
            .catch(err => console.log(err))

        })
    })

    client.on('Chat Message', (message, username, lobby) => {
      if (username) {
        io.to(lobby).emit('New Message', message, username)
      }
    })

    client.on('Start Game', (lobbyId) => {
      Lobby.findById(lobbyId)
        .then(lobby => {
          lobby.gameState = 'Playing'
          lobby.czar = lobby.users[0].id //Math.floor(Math.random()*lobby.users.length)

          lobby.currBlack = lobby.blackCards.splice(Math.floor(Math.random() * lobby.blackCards.length), 1)[0]
          lobby.save()
            .then(lobby => {

              io.to(lobbyId).emit('Update Players', lobby)
            })
        })
    })

    client.on('Submit Card', (lobbyId, userId, card) => {
      Lobby.findById(lobbyId)
        .then(lobby => {
          lobby.playedWhite.push({ card, userId })
          const user = lobby.users.reduce((me, user) => {
            if (user.id === userId) {
              return user
            }
            return me
          }, null)
          user.cards.splice(user.cards.indexOf(card), 1)
          user.played = true;
          lobby.save()
            .then(lobby => {
              Lobby.findByIdAndUpdate(lobbyId, lobby)
                .then(newLobby => {
                  io.to(lobbyId).emit('Update Players', lobby)
                })
                .catch(err => console.log(err))

            })
        })
        .catch(err => console.log(err))

    })

  })


}