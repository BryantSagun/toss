const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ToSDocumentSchema = new Schema({
     content: {
          type: String,
     }
}, { timestamps: true })

const ToSDocument = mongoose.model('tosdoc', ToSDocumentSchema)

module.exports = ToSDocument