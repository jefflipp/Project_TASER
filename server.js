var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var port = process.env.PORT || 3000;
var apiRoutes = express.Router() // get an instance of the router
var userRoutes = require('./app/routes/userRoutes')
var path = require('path')
var session = require('express-session');
var ejsLayouts = require("express-ejs-layouts");
var passport = require('passport');

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
    console.log(req.user)
    global.user = req.user;
    next()
});

// write a simple get '/' route for the api
/*apiRouter.get('/', function(req, res){
    res.render('{message: "welcome to the api"}')
})*/

app.get('/flickr', function(req, res){
    res.render('flickr')
})

// tell app to use apiRoutes when we go to 
// localhost:3000/api
app.use('/api', apiRoutes )

app.use( '/', userRoutes( passport ) )

//RUN THE SERVER

app.listen(3000)
console.log("server is running on port 3000")