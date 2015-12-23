/**
 * Created by Matthieu on 25/11/2015.
 */

var mongoose = require('mongoose');
var relationship = require('mongoose-relationship');
var Schema = mongoose.Schema;

var ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    photo: {
        type: String
    },
    user:{ type:Schema.ObjectId, ref:'User', childPath:'items'},
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
},{
    versionKey : false
});
var Item  = mongoose.model("Item", ItemSchema);

module.exports = Item;
