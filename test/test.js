/**
 * Created by Matthieu on 25/11/2015.
 */

var User = require('../persistence/User');
var Comment = require('../persistence/Comment');
var Item = require('../persistence/Item');
var assert = require('assert');
var passwordHash = require('password-hash');
var should = require('chai').should();

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;

db.once('open', function (callback) {
    //emptyDB();
    create();

    /* it('should return -1 when the value is not present', function () {
     testDB();
     assert.equal(1, 1);
     });
     emptyDB();*/
});


var create = function () {
    var Claude = new User({username: 'claude45', password: passwordHash.generate('clauclau'), firstname: 'Claude', lastname: 'Dupont'});
    Claude.save(function (err) {
        if (err) console.log(err);
        console.log('claude created');
    });
    var Matthieu = new User({username: 'matt45', password: passwordHash.generate('mattmatt'), firstname: 'Matthieu', lastname: 'Lemonnier'});
    Matthieu.save(function (err) {
        if (err) console.log(err);
        console.log('Matthieu created');
    });
    var Marion = new User({username: 'marion45', password: passwordHash.generate('marmar'), firstname: 'Marion', lastname: 'lolilol'});
    Marion.save(function (err) {
        if (err) console.log(err);
        console.log('Marion created');
    });

    var Alice = new User({username: 'alicette', password: passwordHash.generate('alilice'), firstname: 'Alice', lastname: 'Moretti'});
    Alice.save(function (err) {
        if (err) console.log(err);
        console.log('Alice created');
    });

    var ItemAlice1 = new Item({name: 'bonjour', description: 'juste pour faire coucou', user: Alice._id, photo:'http://blog.e-artplastic.net/images/references/curiosite_3.jpg'});
    ItemAlice1.save(function (err) {
        if (err) console.log(err);
        console.log('itemAlice1 created');
    });

    var ItemAlice2 = new Item({name: 'aurevoir', description: 'bon bah j\'y vais!', user: Alice._id,  photo:'http://blog.e-artplastic.net/images/references/curiosite_3.jpg'});
    ItemAlice2.save(function (err) {
        if (err) console.log(err);
        console.log('itemAlice2 created');
    });

    var ItemAlice3 = new Item({name: 'bonjour3', description: 'juste pour faire coucou3', user: Alice._id,  photo:'http://blog.e-artplastic.net/images/references/curiosite_3.jpg'});
    ItemAlice3.save(function (err) {
        if (err) console.log(err);
        console.log('itemAlice3 created');
    });
    var ItemAlice4 = new Item({name: 'bonjour4', description: 'juste pour faire coucou4', user: Alice._id,  photo:'http://blog.e-artplastic.net/images/references/curiosite_3.jpg'});
    ItemAlice4.save(function (err) {
        if (err) console.log(err);
        console.log('itemAlice4 created');
    });
    var ItemAlice5 = new Item({name: 'bonjour5', description: 'juste pour faire coucou5', user: Alice._id,  photo:'http://blog.e-artplastic.net/images/references/curiosite_3.jpg'});
    ItemAlice5.save(function (err) {
        if (err) console.log(err);
        console.log('itemAlice5 created');
    });

    var commentClaude1 = new Comment({content: 'ah ok, salut!', user: Claude._id, Item: ItemAlice1._id});
    commentClaude1.save(function (err) {
        if (err) console.log(err);
        console.log('commentClaude1 created');
    });
    ItemAlice1.comments.push(commentClaude1);
}

var emptyDB = function () {
    User.remove({}, function (err) {
        if (err) console.log(err);
        console.log('users deleted');
    })

    Comment.remove({}, function (err) {
        if (err) console.log(err);
        console.log('comments deleted');
    })
    Item.remove({}, function (err) {
        if (err) console.log(err);
        console.log('items deleted');
    })
    console.log('Db has been cleaned')
}

var testDB = function () {
    var users, Items, comments;
    User.find(function (err, results) {
        if (err) console.log(err);
        users = results;
        assert.equal(users.length, 3);
    });
    Item.find(function (err, results) {
        if (err) console.log(err);
        Items = results;
        assert.equal(Items.length, 2);
    });
    Comment.find(function (err, results) {
        if (err) console.log(err);
        comments = results;
        assert.equal(comments.length, 1);
    });
};

