/* eslint-disable semi */
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user.js')

/**
 * Renders Signup template
 */
router.get('/sign-up', (req, res) => {
  const x = req.nToken
  if (x) {
    res.redirect(',')
  }
  res.render('signup')
})

/**
 * Renders login page
 */

router.get('/login', (req, res) => {
  res.render('login')
})

/**
 *  Register usr with this endpoint
 */

router.post('/register', (req, res) => {
  const user = new User(req.body)
  user.save().then((user) => {
    console.log('user creation successful')
    const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '10 days' })
    res.cookie('nToken', token, { maxAge: 90000000, httpOnly: true })
    res.redirect('/')
  })
})

router.get('/logout', (req, res) => {
  res.clearCookie('nToken')
  res.redirect('/')
})

router.post('/login', (req, res) => {
  const { username } = req.body
  const { password } = req.body
  // Find this user name
  User.findOne({ username }, 'username password')
    .then((user) => {
      if (!user) {
        // User not found
        return res.status(401).send({ message: 'Wrong Email or Password' })
      }
      // Check the password
      user.comparePassword(password, (err, isMatch) => {
        if (!isMatch) {
          // Password does not match
          return res.status(401).send({ message: 'Wrong Email or Password' })
        }
        // Create a token
        const token = jwt.sign({ _id: user._id, username: user.username, name: user.name }, process.env.SECRET, {
          expiresIn: '10 days',
        })
        console.log('login success')
        // Set a cookie and redirect to root
        res.cookie('nToken', token, { maxAge: 90000000, httpOnly: true })
        res.redirect('/')
      })
    })
    .catch((err) => {
      throw err
    })
})

module.exports = router
