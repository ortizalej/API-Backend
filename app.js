var UserService = require('./services/user.service');
var SurveyService = require('./services/survey.service');

const express = require('express')
const bodyParser = require("body-parser")
const mongoose = require('mongoose')
const http = require('http');
const User = require('./dataModel');
require('./dataModel')
const app = express()

app.use(bodyParser.json())

const userSchema = mongoose.model('users')
const questionSchema = mongoose.model('question')

const mongouri = 'mongodb+srv://ortizalej:24472872@api.hfxha.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(mongouri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
mongoose.connection.on("connected", () => console.log("connected to mongo"))
mongoose.connection.on("error", (err) => console.log("error ", err))

app.get('/', (req, res) => {
    res.send('success')
})


app.post('/updateEncuesta', (req, res) => {

    // Id is necessary for the update
    if (!req.body.id) {
        return res.status(400).json({ status: 400., message: "ID must be present" })
    }

    var encuesta = {
        id: req.body.id ? req.body.id : null,
        question: req.body.questions ? req.body.questions : null
    }
    try {
        var updEncuesta = surveyService.updateSurvey(encuesta)
        return res.status(200).json({ status: 200, data: updEncuesta, message: "Succesfully Updated Survey" })
    } catch (e) {
        return res.status(400).json({ status: 400., message: e.message })
    }

})

app.post('/getEncuesta', (req, res) => {
    //Buscar por Empresa-Encuesta
    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 10;
    let id_encuesta = { id: req.body.id }

    try {
        var encuesta = SurveyService.getEncuesta(id_encuesta, page, limit)
        return res.status(200).json({ status: 200, data: encuesta, message: "Succesfully Survey Recieved" });
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({ status: 400, message: e.message });
    }


})

app.post('/getTableData', (req, res) => {
    //Llamar en el render del Home()
})

app.get('/getUsers', (req, res) => {

    try {
        User.find(function (err, users) {
            console.log('USERS', users)
            console.log('ERROR', err)
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
            console.log(user)
            if (user) {
                return res.status(201).json({ message: "Succesfully login" })
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
            res.send({ status: "success" })
        }).catch(err => {
            console.log(err)
            res.send({ status: "error" })
        })
})

app.post('/updateUser', (req, res) => {
    const user = new userSchema({
        username: req.body.username,
        password: req.body.password,
        role: req.body.role
    })
    let query = { 'username': req.body.userData.username };

    user.updateOne(query, req.body.newData, { upsert: true }, function (err, doc) {
        if (err) return res.send(500, { error: err });
        return res.send('Succesfully saved.');
    });
})

app.delete('/deleteUser', (req, res) => {
    var id = req.params.id;
    try {
        var deleted = UserService.deleteUser(id);
        res.status(200).send("User Succesfully Deleted");
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message })
    }

})


app.set('port', process.env.PORT || 3000);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});