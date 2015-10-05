var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt-nodejs')

//user schema
var UserSchema = new Schema({
    name: String,
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true, select: false}
})

// hash the password before anything is saved
UserSchema.pre('save', function(next){
    var user = this;

    // only hash the password if the password has changed (or the user is a new user)
    if(!user.isModified('password')) return next()

    // generate the salt
    bcrypt.hash(user.password, null, null, function(err, hash){
        user.password = hash
        next()
    })
})

// Add a method that compares the stored/hashed version of the password with a param that we pass in
UserSchema.methods.comparePassword = function(password){
    var user = this;
    return bcrypt.compareSync(password, user.password)
}


module.exports = mongoose.model('User', UserSchema)