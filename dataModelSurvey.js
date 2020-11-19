const mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')


const surveySchema = new mongoose.Schema({
    id: String,
    questions: [questionSchema]
})

surveySchema.plugin(mongoosePaginate)

mongoose.model("question", questionSchema)
mongoose.model("table", tableSchema)
const Survey = mongoose.model("survey", surveySchema)

module.exports = Survey;
