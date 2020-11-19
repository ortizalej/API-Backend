const mongoose = require('mongoose')


const surveySchema = new mongoose.Schema({
    "company": {
        "type": "String"
    },
    "name": {
        "type": "String"
    },
    "id": {
        "type": "ObjectId"
    },
    "questions": {
        "type": [
            "Mixed"
        ]
    }
})

const Survey = mongoose.model("survey", surveySchema)

module.exports = Survey;
