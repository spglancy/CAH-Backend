// IMPORTANT
// Sync var names w/ team

module.exports = (io) => {

  const User = require('../models/user')

  io.on('connection', (client) => {

    // all io.on's can be used as promises. here, that's what they are.

    // SEE a single profile
    client.on('hey-ME-1', userId => {
      User.findById(userId)
        .then(user => {
          seeProfile.emit('hey-YOU-1', user)
        })
    })

    // EDIT/UPDATE a profile
    client.on('hey-ME-2', body => {
      User.findByIdAndUpdate(body._id, body)
        .then(() => {
          client.emit('yay')
        })
    })
  })

}