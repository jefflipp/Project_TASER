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

module.exports = {
	index: index,
	create: create,
	show: show,
	update: update,
	destroy: destroy
}



