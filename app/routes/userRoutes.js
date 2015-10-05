var express = require('express')
var apiRouter = express.Router()
var usersController = require('../controllers/usersControllers')
var User = require('../models/User')


apiRouter.use(function(req,res,next){
	// Need to authenticate, jsut send message for now
	console.log('someone is using our API, we will authticate them here')
	// if not logged in res.json({message: "please log in"})
	// else, next ()
	next()
})
// set up index/get for api router
apiRouter.route('/users')
	.get(usersController.index)
	// for creating a new user
	.post(usersController.create)

apiRouter.route('/users/:user_id')
	// this is the show action 
	.get(usersController.show)

	// this is the update action
	.put(usersController.update)

	// this is the destroy function
	.delete(usersController.destroy)

module.exports = apiRouter
