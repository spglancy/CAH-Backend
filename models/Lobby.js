const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LobbySchema = new Schema({
  users: [],
  owner: String,
  whiteCards: [],
  blackCards: [],
  currBlack: Object,
  playedWhite: [],
  strId: String,
  sets: [],
  czar: String,
  gameState: String, //game states: Idle: waiting for people to join, Playing: players select cards, Selecting: card csar selects a winning card
  hands: [{ user: String, card: String, bCard: String }],
})

module.exports = mongoose.model("Lobby", LobbySchema)
