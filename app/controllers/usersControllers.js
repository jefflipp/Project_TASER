
var User = require("../models/User.js");

function index(req, res){
	User.find(function(err,users){
		if(err) res.send(err)
		res.json(users)
	})
}

function create(req, res){
	var user = new User()
	user.name = req.body.name
	user.username = req.body.username
	user.password = req.body.password

	// try to save this new user to the db
	user.save(function(err){
		if(err) return res.json({message: "there is a problem"})
		
		res.json({ message: "new user created!"})
	})
}

function show(req,res){
	User.findById(req.params.user_id, function(err, user){
		if(err) res.send(err)
		res.json(user)
	})
}

function update(req, res){
	// grab the user from the database
	User.findById(req.params.user_id, function(err, user){
		if(err) {
			res.send(err)
		}
		// assign user name
		if(req.body.name){
			user.name = req.body.name
		}
		// assign user username
		if(req.body.username){
			user.username = req.body.username
		}
		// assign user pw
		if(req.body.password){
			user.password = req.body.password
		}
		// save with new info to db
		user.save(function(err){
			if(err){
				res.send(err)
			}
			res.json({message: "user updated"})
		})
	})
}

function destroy(req, res){
	// delete the user with the id in the url
	User.remove({_id: req.params.user_id}, function(err, user){
		if(err){
			res.send(err)
		}
		res.json({message: "deleted"})
	})
}

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = {
	index: index,
	create: create,
	show: show,
	update: update,
	destroy: destroy,
	indexPage: function ( req, res) {
		res.render( 'index' )
	},
	loginPage: function ( req, res) {
		res.render( 'login' )
	},
	profilePage: function ( req, res ) {
		res.render( 'profile', {
			user : req.user // will get the user out of the session
		})
	},
	//Unsure about this one
	login: function ( req, res ) {
		passport.authenticate( 'local-login', {
			successRedirect : '/profile',
			failureRedirect : '/login'
		}) 
	},
	logout: function ( req, res ) {
		req.logout();
		res.redirect( '/' );
	},
	signupPage: function ( req, res ){
		res.render( 'signup' );
	},
	signup: function ( req, res ){
		passport.authenticate( 'local-signup', {
			successRedirect: '/profile',
			failureRedirect: '/signup'
		}) 
	}
}



