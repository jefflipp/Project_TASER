var LocalStrategy   = require( 'passport-local' ).Strategy;
var User            = require( '../models/user' );


module.exports = function(passport){

		//passport session sign in -- needed for persistent login

		passport.serializeUser(function(user, done){
			done(null, user.id);
		});

		// used to deserailize the user
		passport.deserializeUser(function(id, done){
			User.findById(id, function(err, user){
				done(err, user);
			});
		});

		//USER LOCAL SIGNUP

		passport.use('local-signup', new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password',
			passReqToCallback: true // passes through the request back to the callback
		},
		function(req, username, password, done) {

			//this is asynchronous so User.findOne won't fire unless data sent back
			process.nextTick(function(){

				User.findOne({ 'username' : username }, function(err, user){
					if (err)
						return done (err);

					//check to see if there is a user
					if (user) {
						return done(null, false, ( {message: 'That username is alraedy taken'} ))
					} else {
						
						var newUser				= new User();

						newUser.username 	= username;
						newUser.password 	= newUser.generateHash(password);

						newUser.save(function(err) {
							if (err)
								throw err;
							return done(null, newUser);
						});
					}
				});
			});
		}));

		//	USER LOCAL LOGIN

		passport.use('local-login', new LocalStrategy) ({
        // by default, local strategy uses username and password, we will override with username
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    	}),

	    function(req, username, password, done) { // callback with username and password from our form

        // find a user whose username is the same as the forms username
        // we are checking to see if the user trying to login already exists
	        User.findOne({ 'username' :  username }, function(err, user) {
	            // if there are any errors, return the error before anything else
	            if (err)
	                return done(err);

	            // if no user is found, return the message
	            if (!user)
	                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

	            // if the user is found but the password is wrong
	            if (!user.validPassword(password))
	                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

	            // all is well, return successful user
	            return done(null, user);
	        });


			};
}


 
