var cors = require('cors');
const express = require('express')
const bodyParser = require("body-parser")
const mongoose = require('mongoose')
const http = require('http');
const axios = require('axios');
const User = require('./dataModel');
const Survey = require('./dataModelSurvey');
const app = express()
const userSchema = mongoose.model('users')
const surveySchema = mongoose.model('survey')
const mongouri = 'mongodb+srv://ortizalej:24472872@api.hfxha.mongodb.net/test?retryWrites=true&w=majority';
const nodemailer = require("nodemailer");

mongoose.connect(mongouri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
app.use(cors({ origin: '*' }));
app.use(bodyParser.json())
mongoose.connection.on("connected", () => console.log("connected to mongo"))
mongoose.connection.on("error", (err) => console.log("error ", err))

app.get('/', (req, res) => {
    res.send('success')
})
function mapToInternalModel(data) {
    let finalModel = {}
    finalModel.company = data.company.name;
    finalModel.name = data.name
    finalModel.cod = data.id
    finalModel.status = "ANSWERED";
    let questions = [];
    data.sections.map((x) => {
        x.questions.map((y) => {
            questions.push(y);
        })
    })
    let internalModel = [];

    questions.map((x => {
        internalModel.push({
            type: chooseType(x.type),
            question: x.title,
            answer: choseAnswerModel(x)
        })
    }))
    finalModel.questions = internalModel
    return finalModel;
}
function chooseType(data) {
    switch (data) {
        case "TEXT": return 1;
        case "SELECT": return 2;
        case "CHOICE": return 2;
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
        case "CHOICE":
            let optionChoice = [];
            data.options.map((x, index) => {
                optionChoice.push({
                    selected: data.value == index ? true : false,
                    label: x
                })
            })
            return [
                {
                    options: optionChoice,
                    comment: []
                }
            ]
        default:
            let subQuestions = [];
            data.questions.map((x) => {
                let item = {
                    type: x.type,
                    question: x.title,
                    answer: x.value,
                    adornment: x.adornment,
                    comment: []
                }
                subQuestions.push(item)

            })
            return subQuestions
    }
}

function excludeExistingSurveys(pymesSurveys, databaseSurveys) {
    let surveyPyme = pymesSurveys;
    let DbSurveys = databaseSurveys;

    let finalSurveys = [];
    surveyPyme.map((survey) => {
        let exist = false;
        DbSurveys.map((dBSurvey) => {
            if (survey.cod == dBSurvey.cod) {
                exist = true;
            }
        })

        if (!exist) {
            finalSurveys.push(survey)
        }
    })
    return finalSurveys
}

app.post('/updateSurvey', (req, res) => {
    // Id is necessary for the update
    let query = { '_id': req.body._id };

    Survey.findByIdAndUpdate(query, req.body).then(data => {
        return res.status(201).json({ message: "Succesfully update", data: data })
    }).catch(err => {
        console.log(err)
        return res.status(400).json({ status: "error" })
    })
})

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(user) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        port: 587,
        auth: {
            user: 'observatorio.pyme.uade@gmail.com',
            pass: 'api.2020.2c'
        }
    });

    transporter.sendMail({
        from: "observatorio.pyme.uade@gmail.com",
        to: user.username,
        subject: "Observatorio PYME - Datos de cuenta",
        text: "Sus datos de usuario son: Nombre de usuario:" + user.username + " password: " + user.password 
    }, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + JSON.stringify(response));
        }
    });

}



app.get('/getSurveys', (req, res) => {

    try {
        axios.get('https://observatorio-pyme-answer-back.herokuapp.com/external-api/polls', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
                'x-api-key': '5CD4ED173E1C95FE763B753A297D5',
                'accept': 'application/json'
            }
        })
            .then(function (response) {
                let newResponse = []

                response.data.map((survey, index) => {
                    let surveyParse = mapToInternalModel(survey)
                    newResponse.push(surveyParse)
                })
                Survey.find(function (err, surveys) {
                    let newSurveys = excludeExistingSurveys(newResponse, surveys)
                    Survey.insertMany(newSurveys).then(function (data) {
                        surveys = surveys.concat(data);
                        return res.status(200).json({ status: 200, data: surveys, message: "Succesfully Surveys Recieved" });
                    }).catch(function (error) {
                        return res.status(400).json({ status: 400, message: error });
                    });

                })
            })
            .catch(function (error) {
                return res.status(400).json({ status: 400, message: error });
            })
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({ status: 400, message: e.message });
    }
})

app.get('/updateSurvey', (req, res) => {

    try {
        let query = { '_id': req.body._id };

        Survey.updateOne(query, req.body).then(data => {
            console.log(data)
            return res.status(201).json({ message: "Succesfully update", data: data })
        }).catch(err => {
            console.log(err)
            return res.status(400).json({ status: "error" })
        })
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({ status: 400, message: e.message });
    }
})

app.get('/getUsers', (req, res) => {

    try {
        User.find(function (err, users) {
            return res.status(200).json({ status: 200, data: users, message: "Succesfully Users Recieved" });
        })
        // Return the Users list with the appropriate HTTP password Code and Message.
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({ status: 400, message: e.message });
    }

})

app.post('/loginUser', (req, res) => {
    try {
        // Calling the Service function with the new object from the Request Body
        User.findOne({
            username: req.body.username,
            password: req.body.password
        }, function (err, user) {
            console.log('USER', user)
            if (user) {
                return res.status(201).json({ message: "Succesfully login", data: user })
            } else {
                return res.status(400).json({ message: "Dont exist the user" })

            }
        });
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({ status: 400, message: "Invalid username or password" })
    }
})

app.post('/createUser', (req, res) => {
    //crear Usuario

    const user = new userSchema({
        username: req.body.username,
        password: req.body.password,
        role: req.body.role
    })
    user.save().
        then(data => {
            console.log(data)
            sendMail(data)
            return res.status(201).json({ message: "Succesfully created", data: data })

        }).catch(err => {
            console.log(err)
            return res.status(400).json({ status: "error" })
        })
})

app.post('/updateUser', (req, res) => {

    let query = { '_id': req.body._id };

    User.findOneAndUpdate(query, req.body).then(data => {
        console.log(data)
        sendMail(req.body)
        return res.status(201).json({ message: "Succesfully created", data: data })
    }).catch(err => {
        console.log(err)
        return res.status(400).json({ status: "error" })
    })

})

app.post('/deleteUser', (req, res) => {
    try {
        console.log(req.body)
        User.findByIdAndDelete(req.body._id).then(data => {
            console.log(data)
            return res.status(201).json({ message: "Succesfully deleted", data: data })
        }).catch(err => {
            console.log(err)
            return res.status(400).json({ status: "error" })
        })

        res.status(200).send("User Succesfully Deleted");
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message })
    }

})


app.set('port', process.env.PORT || 3000);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

