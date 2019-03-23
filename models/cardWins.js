const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cardWinsSchema = new Schema({
  blackCard: String,
  winningCards: []
})

module.exports = mongoose.model("cardWins", cardWinsSchema)
