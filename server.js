var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var path = require('path')
var session = require('express-session');
var ejsLayouts = require("express-ejs-layouts");
var routes = require('./app/routes/userRoutes');
var flash = require( "connect-flash" );




mongoose.connect('localhost:27017/project_3')

//require('./app/config/passport')(passport)  //passes in passport for config

// APP CONFIGURATION
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(morgan('dev'))


// executes ejs engine
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

// passport requirements
app.use(session({ 
    secret: 'supersupersecret', 
    resave: true,
    saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session()); //persistent login session
app.use(function (req, res, next){
    global.user = req.user;
    next()
});
app.use( flash() ); 

app.get('/', function(req, res){
    res.render('index')
})

app.get('/flickr', function(req, res){
    res.render('flickr')
})

// tell app to use apiRoutes when we go to 
// localhost:3000/api
require("./app/config/passport")(passport)
app.use( routes );

//RUN THE SERVER

app.listen(3000)
console.log("server is running on port 3000")