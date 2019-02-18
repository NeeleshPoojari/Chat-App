var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

var dbUrl = '**'

var Message = mongoose.model('Message',{
    name: String,
    message: String
})

app.get('/messages', (req, res) => {
    Message.find({},(err,messages) =>
    {
        res.send(messages);
    })
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body)
    message.save((err) => {
        if(err)
           res.sendStatus(500)

        io.emit('message', req.body)
        //messages.push(req.body)
        res.sendStatus(200);

    })
   

})
io.on('connection', (socket) => {
    console.log('a user connected')
})

mongoose.connect(dbUrl, {useMongoClient:true},(err) => {
    console.log('mongo db connection', err)
})

var server = http.listen(4000, (err) => {
    console.log('running on port:' + server.address().port, 'err:' + err)
})