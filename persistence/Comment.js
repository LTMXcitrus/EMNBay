/**
 * Created by Matthieu on 25/11/2015.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true
    },
    item:{ type:Schema.ObjectId, ref:'Item', childPath:'comments'},
    user:{ type:Schema.ObjectId, ref:'User', childPath:'comments'}
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
