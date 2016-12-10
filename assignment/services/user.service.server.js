/**
 * Created by Nikhil S on 28-Oct-16.
 */

module.exports = function (app, model) {
    "use strict";

    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    var cookieParser = require('cookie-parser');
    var session = require('express-session');

    var googleConfig = {
        clientID     : process.env.GOOGLE_CLIENT_ID,
        clientSecret : process.env.GOOGLE_CLIENT_SECRET,
        callbackURL  : process.env.GOOGLE_CALLBACK_URL
    };

    //Client ID : 84139842365-b2lfd7cshbdtsdihbhl2c54i3vnqfvet.apps.googleusercontent.com
    //Cliend URL: KWM1H-JrhxRNTIH_pICulBeR

    app.use(session({
        secret: 'this is a secret',
        resave: true,
        saveUninitialized: true
    }));
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(localStrategy));
    passport.use(new GoogleStrategy(googleConfig, googleStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.post('/api/login', passport.authenticate('local'), login);
    app.post('/api/checkLogin', checkLogin);
    app.post('/api/logout', logout);
    app.post('/api/user', createUser);
    app.get('/api/user', findUser);
    app.get('/api/user?username=username', findUserByUsername);
    app.get('/api/user?username=username&password=password', findUserByCredentials);
    app.get('/api/user/:uid', findUserById);
    app.put('/api/user/:uid', loggedInAndSelf, updateUser);
    app.delete('/api/user/:uid', loggedInAndSelf, deleteUser);

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/assignment/#/user',
            failureRedirect: '/assignment/#/login'
        }));

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        model
            .userModel
            .findUserById(user._id)
            .then(
                function (user) {
                    done(null, user);
                },
                function (error) {
                    done(error, null);
                }
            );
    }

    function localStrategy(username, password, done) {
        model
            .userModel
            .findUserByCredentials(username, password)
            .then(
                function (listOfExistingUsers) {
                    if (0 === listOfExistingUsers.length) {
                        return done(null, false);
                    } else {
                        var user = listOfExistingUsers[0];
                        if (user.username === username && user.password === password) {
                            return done(null, user);
                        } else {
                            return done(null, false);
                        }
                    }
                },
                function (error) {
                    return done(error);
                }
            );
    }
    
    function loggedInAndSelf(req, res, next) {
        var loggedIn = req.isAuthenticated();
        var userId = req.params.uid;
        var self = userId == req.user._id;
        if (self && loggedIn) {
            next();
        } else {
            res.sendStatus(400).send("User not logged in");
        }
    }

    function googleStrategy(token, refreshToken, profile, done) {
        model
            .userModel
            .findUserByGoogleId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var email = profile.emails[0].value;
                        var emailParts = email.split("@");
                        var newGoogleUser = {
                            username:  emailParts[0],
                            firstName: profile.name.givenName,
                            lastName:  profile.name.familyName,
                            email:     email,
                            google: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        return model.userModel.createUser(newGoogleUser);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function checkLogin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function logout(req, res) {
        req.logout();
        res.send(200);
    }

    function createUser(req, res) {
        var user = req.body;
        model
            .userModel
            .findUserByUsername(user.username)
            .then(
                function (listOfExistingUsers) {
                    if (0 !== listOfExistingUsers.length) {
                        res.send('0');
                    } else {
                        model
                            .userModel
                            .createUser(user)
                            .then(
                                function (newUser) {
                                    res.send(newUser)
                                },
                                function (error) {
                                    res.sendStatus(400).send(error);
                                }
                            );
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function findUser(req, res) {
        var query = req.query;
        if (query.password && query.username) {
            findUserByCredentials(req, res);
        } else if (query.username) {
            findUserByUsername(req, res);
        } else {
            res.json(req.user);
        }
    }

    function findUserByUsername(req, res) {
        var username = req.query.username;
        model
            .userModel
            .findUserByUsername(username)
            .then(
                function (listOfExistingUsers) {
                    if (0 === listOfExistingUsers.length) {
                        res.send('0');
                    } else {
                        var user = listOfExistingUsers[0];
                        res.send(user);
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            )
    }

    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        model
            .userModel
            .findUserByCredentials(username, password)
            .then(
                function (listOfExistingUsers) {
                    if (0 === listOfExistingUsers.length) {
                        res.send('0');
                    } else {
                        var user = listOfExistingUsers[0];
                        if (user.username === username && user.password === password) {
                            res.send(user);
                        } else {
                            res.send('0');
                        }
                    }
                }
            );
    }

    function findUserById(req, res) {
        var uid = req.params.uid;
        model
            .userModel
            .findUserById(uid)
            .then(
                function (user) {
                    if (user) {
                        res.send(user);
                    } else {
                        res.send('0');
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function updateUser(req, res) {
        var userId = req.params.uid;
        var user = req.body;
        model
            .userModel
            .findUserById(userId)
            .then(
                function (existingUser) {
                    if (existingUser) {
                        if (existingUser.username === user.username) {
                            model
                                .userModel
                                .updateUser(userId, user)
                                .then(
                                    function (response) {
                                        res.send(true);
                                    },
                                    function (error) {
                                        res.sendStatus(400).send(error);
                                    }
                                );
                        } else {
                            model
                                .userModel
                                .findUserByUsername(user.username)
                                .then(
                                    function (listOfExistingUsers) {
                                        if (0 === listOfExistingUsers.length) {
                                            model
                                                .userModel
                                                .updateUser(userId, user)
                                                .then(
                                                    function (response) {
                                                        res.send(true);
                                                    },
                                                    function (error) {
                                                        res.sendStatus(400).send(error);
                                                    }
                                                );
                                        } else {
                                            res.send(false);
                                        }
                                    },
                                    function (error) {
                                        res.sendStatus(400).send(error);
                                    }
                                );
                        }
                    } else {
                        res.send('0');
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function deleteUser(req, res) {
        var userId = req.params.uid;
        model
            .userModel
            .deleteUser(userId)
            .then(
                function (response) {
                    res.send(true);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function generateNewId() {
        return new Date().getTime().toString();
    }

    function cloneObject(object) {
        return JSON.parse(JSON.stringify(object));
    }
};