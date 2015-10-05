var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var port = process.env.PORT || 3000;
var apiRouter = express.Router() // get an instance of the router
var userRoutes = require('./app/routes/userRoutes')
var path = require('path')
var ejsLayouts = require("express-ejs-layouts");

mongoose.connect('localhost:27017/project_3')

// APP CONFIGURATION
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use('/api', apiRouter) // tell the app to use the apiRouter if it receives a request with /api at the start

// executes ejs engine
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

// write a simple get '/' route for the api
apiRouter.get('/', function(req, res){
    res.render('{message: "welcome to the api"}')
})

app.get('/', function(req, res){
    res.render('index')
})

// tell app to use apiRouter when we go to 
// localhost:3000/api
app.use('/api', apiRouter)
app.use('/api', userRoutes)

//RUN THE SERVER

app.listen(3000)
console.log("server is running on port 3000")