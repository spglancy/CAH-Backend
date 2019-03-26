/* eslint-disable no-underscore-dangle */
/* eslint-disable semi */
module.exports = (io) => {
  const jwt = require('jsonwebtoken')
  const User = require('../models/user.js')
  io.on('connection', (client) => {
    // checks user auth and logs in
    client.on('Login', body => {
      const email = body.email.toLowerCase()
      const password = body.password
      // Find this user name
      User.findOne({ email })
        .then((user) => {
          console.log(user)
          if (!user) {
            // User not found
            client.emit('authRes', {
              result: 'Unsuccessful',
              message: 'Wrong Email or Password',
            })
          }
          // Check the password
          console.log(password)
          user.comparePassword(password, (err, isMatch) => {
            console.log(isMatch)
            if (!isMatch) {
              // Password does not match
              client.emit('authRes', { 
                result: 'Unsuccessful',
                message: 'Wrong Email or Password',
              })
            }
            const token = jwt.sign({ _id: user._id, name: user.name }, process.env.SECRET, { expiresIn: '60 days' })
            client.emit('authRes', {
              result: 'Success',
              userId: user._id,
              token,
            })
          })
        })
        .catch((err) => {
          console.log(err)
        })
    })

    client.on('Register', body => {
      const { email, password, passwordConf } = body
      let user = {}
      if (password === passwordConf) {
        user = new User(body)
      } else {
        return client.emit('authRes', { message: 'Passwords do not match' })
      }
      user.email = user.email.toLowerCase()
      user.ai = false
      User.findOne({ email }).then((check) => {
        if (!check) {
          user.save().then((u) => {
            const token = jwt.sign({ _id: u._id, name: u.name }, process.env.SECRET, { expiresIn: '60 days' })
            client.emit('authRes',{
              result: 'Success',
              userId: u._id,
              token,
            })
          })
        } else {
          client.emit('authRes',{
            result: 'Unsuccessful',
            message: 'This Email is already in use',
          })
        }
      })
    })
  })
}
