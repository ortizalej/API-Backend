const mongoose = require('mongoose')


const surveySchema = new mongoose.Schema({
    company: String,
    name: String,
    id: String,
    questions: []
})

const Survey = mongoose.model("survey", surveySchema)

module.exports = Survey;
