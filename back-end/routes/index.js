const users = require('../models/users');
const questions = require('../models/questions');

const createError = require('http-errors');
const express = require('express');
const router = express.Router();

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

const jwt = require('jsonwebtoken');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const JWT_SECRET = 'top-secret';






passport.use('signin', new LocalStrategy(async function(username, password, done) {
    const result = await users.checkUserCreds(username, password);
    if (result === false) {
        return done(null, false);
    }
    return done(null, { username: username });

}));

passport.use('token', new JWTstrategy(
    {
        secretOrKey: JWT_SECRET,
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    function(token, done) {
        return done(null, { username: token.username})
    }
));

// POST signin
router.post('/signin',
    passport.authenticate('signin', {session: false}),
    function(req, res, next) {
      res.json({
        token: jwt.sign(req.user, JWT_SECRET, {expiresIn: 36000})
      });
    }
);

// POST register
router.post('/register',
    function(req, res, next) {
        users.insertUser(req.body.username, req.body.password, req.body.email)
            .then(result =>  {
                res.json({
                    id: result.insertedId
                });
            })
            .catch(err => console.error(`Failed to insert item: ${err}`))

    }
);

// GET whoami
router.get('/whoami',
    passport.authenticate('token', {session: false}),
    function(req, res, next) {
        users.findUser(req.user.username)
            .then(result => {
                res.json({
                    result
                })
            })
            .catch(err => console.log(err));
    }
);

// POST question
router.post('/user/:userId/question/',
    passport.authenticate('token', {session: false}),
    function(req, res, next) {
        questions.insertQuestion(req.params.userId, req.body.question, req.body.keywords)
            .then(result => {
                res.json( {
                    res: "new question added",
                    id: result.insertedId
                });
            })
            .catch(err => {
                res.json({
                    res: err.message
                })
            })
    }
);
module.exports = router;
