/**
 * Created by Matthieu on 25/11/2015.
 */
var User = require('../persistence/User');
var Comment = require('../persistence/Comment');
var Item = require('../persistence/Item');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.once('open', function () {
    //create();
    //describeDB();
    //emptyDB();
    refreshDB(true);
});


var create = function(){
    var Claude = new User({username:'claude45',password:'clauclau',firstname:'Claude',lastname:'Dupont'});
    Claude.save(function(err) {
        console.log(err);
    });

    var Alice = new User({username: 'alicette', password:'alilice',firstname:'Alice', lastname:'Moretti'});

    Alice.save(function(err){
        console.log(err);
    });

    var itemAlice1 = new Item({name:'canape',description:'juste pour s\'asseoir',user:Alice._id});
    itemAlice1.save(function(err){
        console.log(err);
    });

    var itemAlice2 = new Item({name:'un lit', description:'bah pour dormir!', user:Alice._id});
    itemAlice2.save(function(err){
        console.log(err);
    })

    var commentClaude1 = new Comment({content:'ah ok, salut!',user:Claude._id,post:itemAlice1._id});
    commentClaude1.save(function(err){
        console.log(err);
    });
}

var emptyDB = function(){
    User.remove({},function(err){
        if(err) console.log(err);
        console.log('Users removed');
    })

    Comment.remove({}, function(err){
        if(err) console.log(err);
        console.log('Comments removed');
    })
    Item.remove({}, function(err){
        if(err) console.log(err);
        console.log('Posts removed');
    })
}

var describeDB = function(){
    User.find(function(err,users){
        if(err) console.log(err);
        console.log("users: "+users);
    });
    Item.find(function(err, items){
        if(err) console.log(err);
        console.log("items: "+items);
    })
    Comment.find(function(err,comments){
        if(err) console.log(err);
        console.log("comments: "+comments);
    });
}

var refreshDB = function(describe){
    emptyDB();
    create();
    if(describe) describeDB();
}




