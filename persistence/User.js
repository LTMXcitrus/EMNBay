/** * Created by Matthieu on 25/11/2015. */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define our user schema
var userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    phone:{
        type: String
    },
    email: {
        type: String
    },
    items: [{type: Schema.Types.ObjectId, ref: 'Item'}],
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]

});
var User = mongoose.model("User", userSchema);

module.exports = User;