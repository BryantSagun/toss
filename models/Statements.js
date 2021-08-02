const mongoose = require('mongoose')
const Schema = mongoose.Schema
const StatementsSchema = new Schema({
     collectingData: [String],
     usingData: [String],
     sharingData: [String]
}, { timestamps: true })

const Statements = mongoose.model('statements', StatementsSchema)

module.exports = Statements