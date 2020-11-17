const mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')

const optionsSchema = new mongoose.Schema({
    selected: Boolean,
    label: String
})

const answerSchema = new mongoose.Schema({
    label: String, //Pregunta abierta
    options: [optionsSchema], //Pregunta multiple choice
    path: String, //Pregunta descarga
    comment: [String]
})

const questionSchema = new mongoose.Schema({
    question: String,
    type: Number,
    answer: [answerSchema]
})

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String
})

const tableSchema = new mongoose.Schema({
    surveyName: String,
    companyName: String,
    status: String
})

const surveySchema = new mongoose.Schema({
    id: String,
    questions: [questionSchema]
})

userSchema.plugin(mongoosePaginate)
surveySchema.plugin(mongoosePaginate)

const User =mongoose.model("users", userSchema)
const Survey = mongoose.model("survey", surveySchema)
mongoose.model("question", questionSchema)
mongoose.model("table", tableSchema)

module.exports = User;
