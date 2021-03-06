var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(express.static(__dirname));

app.use( bodyParser.json());
app.use( bodyParser.urlencoded({extended:false}) );

var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

var dbUrl = 'mongodb://user:user123@ds141613.mlab.com:41613/messages'

var Message = mongoose.model('Message', {
    name:String,
    message:String
})

var messages = [
    {name:'Tim', message: 'Hi'},
    {name: 'Jane', message: 'Hello'}
];
app.get('/messages', (req, res)=>{
   Message.find({}, (err, messages) => {
       res.send(messages);
   });
});

app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save( (err) => {
        if(err){
            sendStatus(500);
        }else {
            io.emit('message', req.body);
            res.sendStatus(200);
        }
    });
});

io.on('connection', (socket) => {
    console.log('A user connected')
})

mongoose.connect(dbUrl, (err) => {
    console.log('mongodb connection', err);
})

var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port);
});