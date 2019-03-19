const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/cah-backend');
const app = express();
const port = 4000

const io = require('socket.io')()

const chatSocket = require('./controllers/chat')(io)
const gameSocket = require('./controllers/game')(io)
const userSocket = require('./controllers/users')(io)

io.listen(port)
