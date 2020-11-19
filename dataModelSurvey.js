const mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')


const surveySchema = new mongoose.Schema({
    id: String
})

surveySchema.plugin(mongoosePaginate)


const Survey = mongoose.model("survey", surveySchema)

module.exports = Survey;
