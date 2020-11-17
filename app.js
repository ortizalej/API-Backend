var UserService = require('./services/user.service');
var SurveyService = require('./services/survey.service');
var cors = require('cors');
const express = require('express')
const bodyParser = require("body-parser")
const mongoose = require('mongoose')
const http = require('http');
const User = require('./dataModel');
require('./dataModel')
const app = express()
const userSchema = mongoose.model('users')
const questionSchema = mongoose.model('question')

const mongouri = 'mongodb+srv://ortizalej:24472872@api.hfxha.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(mongouri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
app.use(cors({origin: '*'}));
app.use(bodyParser.json())
mongoose.connection.on("connected", () => console.log("connected to mongo"))
mongoose.connection.on("error", (err) => console.log("error ", err))

app.get('/', (req, res) => {
    res.send('success')
})


app.post('/updateEncuesta', (req, res) => {

    // Id is necessary for the update
    if (!req.body.id) {
        return res.status(400).json({ status: 400, message: "ID must be present" })
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
            console.log('USER',user)
            if (user) {
                return res.status(201).json({ message: "Succesfully login", data:user})
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
            return res.status(201).json({ message: "Succesfully created", data:data })
        }).catch(err => {
            console.log(err)
            return res.status(400).json({ status: "error" })
        })
})

app.post('/updateUser', (req, res) => {
    const user = new userSchema({
        username: req.body.username,
        password: req.body.password,
        role: req.body.role
    })
    console.log('REQ BODY', req.body)
    let query = { 'username': req.body.username };

    user.update(query, req.body, function (err, doc) {
        if (err) res.status(400).json({ status: "error" });
        return res.status(201).json({ message: "Succesfully update", data:doc })
    });
})

app.delete('/deleteUser', (req, res) => {
    try {
        var deleted = User.remove({
            username: req.body.username
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