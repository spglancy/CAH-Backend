/* eslint-disable no-underscore-dangle */
/* eslint-disable semi */
module.exports = (io) => {
  const jwt = require('jsonwebtoken')
  const User = require('../models/user.js')
  io.on('connection', (client) => {
    // checks user auth and logs in
    client.on('Login', body => {
      console.log("Login Request recieved")
      const email = body.email.toLowerCase()
      const password = body.password
      // Find this user name
      User.findOne({ email })
        .then((user) => {
          console.log("wtf")
          if (!user) {
            // User not found
            console.log("res sent")
            client.emit('authRes', {
              result: 'Unsuccessful',
              message: 'Wrong Email or Password',
            })
          }
          // Check the password
          // not working for some reason
          user.comparePassword(password, (err, isMatch) => {
            if (!isMatch) {
              console.log("res sent")
              // Password does not match
              client.emit('authRes', { 
                result: 'Unsuccessful',
                message: 'Wrong Email or Password',
              })
            }
            console.log("res sent")
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
      console.log("Register request recieved")
      const { email, password, passwordConf } = body
      let user = {}
      if (password === passwordConf) {
        user = new User(body)
      } else {
        console.log("res sent")
        return client.emit('authRes', { message: 'Passwords do not match' })
      }
      user.email = user.email.toLowerCase()
      User.findOne({ email }).then((check) => {
        console.log("wtf")
        if (!check) {
          user.save().then((u) => {
            console.log("res sent")
            const token = jwt.sign({ _id: u._id, name: u.name }, process.env.SECRET, { expiresIn: '60 days' })
            client.emit('authRes',{
              result: 'Success',
              userId: u._id,
              token,
            })
          })
        } else {
          console.log("res sent")
          client.emit('authRes',{
            result: 'Unsuccessful',
            message: 'This Email is already in use',
          })
        }
      })
    })
  })
}
