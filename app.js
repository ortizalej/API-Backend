const express = require('express')
const bodyParser = require("body-parser")
const mongoose = require('mongoose')
const http = require('http');
require('./User')
const app = express()

app.use(bodyParser.json())

const userData = mongoose.model('user')
const mongouri = 'mongodb+srv://ortizalej:24472872@cluster0.asl0p.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(mongouri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on("connected", () => console.log("connected to mongo"))
mongoose.connection.on("error", (err) => console.log("error ", err))

app.get('/', (req, res) => {
    res.send('success')
})

app.post('/send', (req, res) => {

})

app.post('/get', (req, res) => {
})

app.set('port', process.env.PORT || 3000);


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});