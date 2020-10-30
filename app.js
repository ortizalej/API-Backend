const express = require('express')
const bodyParser = require("body-parser")
const mongoose = require('mongoose')
const http = require('http');
require('./dataModel')
const app = express()

app.use(bodyParser.json())

const userSchema = mongoose.model('user')
const questionSchema = mongoose.model('question')

const mongouri = 'mongodb+srv://ortizalej:24472872@api.hfxha.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(mongouri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on("connected", () => console.log("connected to mongo"))
mongoose.connection.on("error", (err) => console.log("error ", err))

app.get('/', (req, res) => {
    res.send('success')
})


app.post('/updateEncuesta', (req, res) => {
    //Update a la tabla y la encuesta el estado
})

app.post('/getEncuesta', (req, res) => {
    //Buscar por Empresa-Encuesta
})

app.post('/getTableData', (req, res) => {
    //Llamar en el render del Home()
})

app.post('/getUsers', (req, res) => {
    //Login y get lista de users
})

app.post('/loginUser',(req,res) => {
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
    let query = {'username': req.body.userData.username};

    user.updateOne(query,req.body.newData,{upsert: true}, function(err, doc) {
        if (err) return res.send(500, {error: err});
        return res.send('Succesfully saved.');
    });
})

app.delete('/deleteUser', (req, res) => {
    //borrar Usuario
})


app.set('port', process.env.PORT || 3000);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});