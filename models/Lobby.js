const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LobbySchema = new Schema({
  users: [],
  whiteCards: [],
  blackCards: [],
  strId: '',
  sets: [],
  hands: [{ user: String, cards: String }],
})

module.exports = mongoose.model("Lobby", LobbySchema)
