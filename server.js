const dotenv = require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/cah-backend');
const io = require('socket.io')()

const chatSocket = require('./controllers/chat')(io)
const gameSocket = require('./controllers/game')(io)
const userSocket = require('./controllers/users')(io)
const authController = require('./controllers/authController')(io)

io.listen(process.env.PORT)
