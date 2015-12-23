var mongoose = require('mongoose');
var fs = require('fs');
var http = require('http');
var https = require('https');
var Post = require('./persistence/Item');
var User = require('./persistence/User')
var Comment = require('./persistence/Comment');
var express  = require('express');
var bodyParser = require('body-parser')
var router = require('./router/Router');
var session = require('express-session');

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var privatekey = fs.readFileSync('./sslcert/privatekey.pem', 'utf8');
var certificate = fs.readFileSync('./sslcert/certificate.pem', 'utf8');

var credentials = {
    key : privatekey,
    cert : certificate
};

var app = express();
app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'egzeuidtn',
    resave: true,
    saveUninitialized: false
}));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(router);
app.use(express.static('./webcontent/app'));
app.use('/uploads',express.static('uploads'));

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    //var server = https.Server(credentials,app).listen(8443);
    var server = http.Server(app).listen(server_port,server_ip_address);
    console.log('connected!');
});