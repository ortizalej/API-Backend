const mongoose = require('mongoose')

const surveySchema = new mongoose.Schema({
    company: String,
    name: String,
    cod: String,
    questions: []
},{ collection: 'survey'})

const Survey = mongoose.model("survey", surveySchema)

module.exports = Survey;
