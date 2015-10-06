var express = require('express')
var apiRouter = express.Router()
var usersController = require('../controllers/usersControllers')
var User = require('../models/User')
var jwt = require('jsonwebtoken')
var passport = require( "passport" )
var mySpecialSecret = "threeamigos"

module.exports = function( app, passport ) {



// apiRouter.route( "/index" )
// 	.get( usersController.index )

// LAYOUT PAGE
	app.get( '/', function( req, res ) {
		res.render( "index" ); //loads the index.ejs file
	});

//	PROFILE
	app.get( '/profile', isLoggedIn, function( req, res ) {
		res.render( 'profile', {
			user : req.user // will get the user out of the session
		})
	})

//	LOGOUT

	app.get( '/logout', function( req, res ) {
		req.logout();
		res.redirect( '/' );
	})

// 	AUTHENTICATE FIRST LOGIN

//	LOGIN
	app.get( '/login', function( req, res ) {
		res.render( 'login' );
	});

	app.post( '/login', passport.authenticate( 'local-login', {
		successRedirect : '/profile',
		failureRedirect : '/login'
	}) );

//	SIGN UP
	app.get( '/signup', function( req, res ) {
		res.render( 'signup' );
	});

//	process the signup form
	app.post( '/signup', passport.authenticate( 'local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup'
		}) );

}

// set up index/get for api router
apiRouter.route('/users')
	.get(usersController.index)
	// for creating a new user
	.post(usersController.create)

apiRouter.route('/users/:user_id')
	// this is the show action 
	.get(usersController.show)


apiRouter.route('/authenticate')
	.post(function(req, res){
	console.log('trying to create a JWT')
	// try to find the user in the db
	User.findOne({
		username: req.body.username
	}).select('name username password').exec(function(err, user){
		if(err) throw err
		if(!user){
			res.json({success: false, message: "auth attempt failed"})
		} else if(user){
			// check the password
			var validPassword = user.comparePassword(req.body.password)
			if(!validPassword){
				res.json({success: false, message: "auth attempt failed, re-check your username and password"})
			} else {
				// password matches, move on
				var token = jwt.sign({
					name: user.name,
					username: user.username
				}, mySpecialSecret, {
					expiresInSeconds: 1440
				})
				// give the user the token
				res.json({ success: true, message: "token is successful", token: token})
			}
		}
	})
})

apiRouter.use(function(req, res, next){
	// check mulitple places for the JWT!
	var token = req.body.token || req.params.token || req.headers['x-access-token']

	// if token is found, use mySpecialSecret to decode.
	if(token){
		jwt.verify(token, mySpecialSecret, function(err, decoded){
			if(err){
				res.status(403).send({success: false, message: "problem with your decoder ring"})
			} else {
				req.decoded = decoded
				next()
			}
		})
	} else {
		res.status(403).send({success: false, message: "dude, where's my token"})
	}
})

apiRouter.use(function(req,res,next){
	// Need to authenticate, just send message for now
	console.log('someone is using our API, we will authticate them here')
	// if not logged in res.json({message: "please log in"})
	// else, next ()
	next()
})

	// this is the update action
	.put(usersController.update)

	// this is the destroy function
	.delete(usersController.destroy)

module.exports = apiRouter
