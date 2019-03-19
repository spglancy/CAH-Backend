const dotenv = require('dotenv').config()
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/cah-backend');
const port = 4000

const io = require('socket.io')()

const chatSocket = require('./controllers/chat')(io)
const gameSocket = require('./controllers/game')(io)
const userSocket = require('./controllers/users')(io)
const authController = require('./controllers/authController')(io)


io.listen(port)
