const { model, Schema } = require("mongoose")

const PaperModel = model(
  "papers",
  new Schema({
    subject: { type: String, required: true },
    paperId: { type: Number, required: true, unique: true},
    semester: { type: Number, required: true },
    year: { type: Number, required: true },
    path: { type: String, required: true }
  })
)

module.exports = { PaperModel }
