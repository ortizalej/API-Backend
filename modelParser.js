
module.exports = function mapToInternalModel(data) {
    let questions;
    data.sections.map((x) => {
        x.questions.map((y) => {
            questions.push(y);
        })
    })

    let internalModel = [];
    questions.map((x => {
        internalModel.push({
            type: this.chooseType(x.type),
            question: x.title,
            answer: choseAnswerModel(x)
        })
    }))

    return internalModel;
}

function chooseType(data) {
    switch (data) {
        case "TEXT": return 1;
        case "SELECT": return 2;
        case "FILE": return 3;
        case "NUMBER": return 4;
        default: return 5;
    }
}

function choseAnswerModel(data) {
    switch (data.type) {
        case "TEXT":
            return [
                {
                    label: data.value,
                    comment: []
                }
            ]
        case "SELECT":
            let choice = [];
            data.options.map((x, index) => {
                choice.push({
                    selected: data.value == index ? true : false,
                    label: x
                })
            })
            return [
                {
                    options: choice,
                    comment: []
                }
            ]
        case "FILE":
            return [
                {
                    path: data.value[0].name,
                    comment: []
                }
            ]
        case "NUMBER":
            return [
                {
                    label: data.value,
                    comment: []
                }
            ]
        default:
            let subQuestions = [];
            data.questions.map((x) => {
                subQuestions.push({
                    type: x.type,
                    question: x.title,
                    answer: x.answer,
                    adornment: x.adornment
                })
            })
            return subQuestions
    }
}