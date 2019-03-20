const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LobbySchema = new Schema({
  users: [],
  owner: String,
  whiteCards: [],
  blackCards: [],
  strId: '',
  sets: [],
  gameState: String, //game states: Idle: waiting for people to join, Playing: players select cards, Selecting: card csar selects a winning card
  hands: [{ user: String, cards: String }],
})

module.exports = mongoose.model("Lobby", LobbySchema)
