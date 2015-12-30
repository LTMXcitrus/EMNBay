/**
 * Created by Matthieu on 25/11/2015.
 */
var user = require('../persistence/User');
var item = require('../persistence/Item');
var Comment = require('../persistence/Comment');
var express = require('express');
var passwordHash = require('password-hash');
var multipart = require('connect-multiparty');
var fs = require('fs');
var router = express.Router();
var multipartMiddleware = multipart();

// Register routes on router
router.get('/', function (req, res, next) {
    res.sendfile('./webcontent/app/index.html');
});


var baseUrl = "/ws";
var uploadsUrl = "/uploads";

router.get(baseUrl + '/items', function (req, res, next) {
    item.find().lean().populate('comments').exec(function (err, items) {
        return res.end(JSON.stringify(items));
    });
});
router.get(baseUrl + '/myitems/:id', function (req, res, next) {
    item.find({user: req.params.id}).lean().populate('comments').exec(function (err, items) {
        return res.end(JSON.stringify(items));
    });
})

router.get(baseUrl + '/item/:id', function (req, res, next) {
    res.writeHead(200);
    item.findOne({_id: req.params.id}).populate({
        path: 'comments',
        select: 'content user'
    }).lean().exec(function (err, item) {
        return res.end(JSON.stringify(item));
    })
});
router.post(baseUrl + '/item', function (req, res, next) {
    var newItem = new item(req.body);
    newItem.save(function (err) {
        if (err) console.log(err);
        res.send({itemId: newItem._id});
    });

});

router.get(baseUrl + '/disconnect', function (req, res, next) {
    req.session.regenerate(function (err) {
        if (err) console.log(err);
        res.send('you have been logged out');
    })
});

router.get(baseUrl + '/whoisit', function (req, res, next) {
    var session = req.session;
    if (session.user) {
        res.send(session.user);
    } else {
        res.send({username: 'unknown'});
    }
});

router.post(baseUrl + '/whoisit', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    user.findOne({username: username}).lean().exec(function (err, user) {
        if (err) {
            res.send({username: 'unknown', error: 'error: something went wrong'});
        } else if (user) {
            if (passwordHash.verify(password, user.password)) {
                setSession(req, user);
                res.send(req.session.user);
            }
            else {
                res.send({username: 'unknown', error: 'error: invalid password'});
            }
        }
        else {
            res.send({username: 'unknown', error: 'error: invalid username'});
        }
    });
});

router.post(baseUrl + '/createAccount', function (req, res, next) {
    var body = req.body;
    var password = passwordHash.generate(body.password);
    body.password = password;
    var newUser = new user(body);
    newUser.save(function (err) {
        if (err) {
            console.log(err);
            res.send({username: 'unknown', error: 'unable to create an account'});
        } else {
            setSession(req, body);
            res.send(req.session.user);
        }
    })

});
router.post(baseUrl + '/uploads/itemPicture/:id', multipartMiddleware, function (req, res, next) {
    var itemId = req.params.id;
    fs.readFile(req.files.file.path, function (err, data) {
        var newPath = uploadsUrl + '/' + (new Date().getTime()) + req.files.file.name;
        fs.writeFile("." + newPath, data, function (err) {
            item.update({_id: itemId}, {photo: newPath}, function (err) {
                if (err) console.log(err);
                res.send('file has been well received !');
            });
        });
    });
});

router.delete(baseUrl + '/deleteitem/:id',
    function (req, res, next) {
        item.findOne({_id: req.params.id}).lean().populate('user').exec(function (err, wantedItem) {
            if (isAdmin(req) || wantedItem.user === getUser(req).id) { //check if user is admin or owner of the item.
                item.remove({_id: req.params.id}, function (err) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        res.send('Item deleted');
                    }
                });
            }
            else {
                res.send('You do not have the right to delete this item.');
            }
        });
    });

router.get(baseUrl + '/users',
    function (req, res, next) {
        user.find({}, {password: 0, items: 0, comments: 0, __v: 0}).lean().exec(function (err, users) {
            return res.end(JSON.stringify(users));
        });
    });
router.get(baseUrl + '/user/:id',
    function (req, res, next) {
        user.findOne({_id:req.params.id},{password:0}).populate('items').lean().exec(function(err,wantedUser){
            item.find({user:req.params.id}).lean().exec(function(err, items){
                wantedUser.items = items;
                return res.end(JSON.stringify(wantedUser));
            });
        });
    });


var setSession = function (req, user) {
    var userSession = {};
    userSession.username = user.username;
    userSession.firstname = user.firstname;
    userSession.lastname = user.lastname;
    userSession.email = user.email;
    userSession.id = user._id;
    req.session.user = userSession;
    console.log('user stored into session.');
    console.log(req.session.user);
};

var getUser = function (req) {
    return req.session.user;
}

var isAdmin = function (req) {
    var user = req.session.user;
    return user && user.username && user.username === 'mattcitron';
}

// Make router available
module.exports = router;

