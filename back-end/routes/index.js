const users = require('../models/users');
const questions = require('../models/questions');
const answers = require('../models/answers');

const createError = require('http-errors');
const express = require('express');
const router = express.Router();

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

const jwt = require('jsonwebtoken');
const {ObjectID} = require("bson");
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
            .catch(err => {
                res.status(400);
                res.json( {
                   msg: err.message
                });
            })

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



router.post('/user/:userId/:questionId/answer',
    passport.authenticate('token', {session: false}),
    function(req, res, next) {
        answers.insertAnswer(req.params.userId, req.params.questionId, req.body.answer)
            .then(result => {
                res.json( {
                    res: "new answer added",
                    id: result.insertedId
                });
            })
            .catch(err => {
                res.status(err.code);
                res.json({
                    res: err.message
                })
            })
    }
);

router.get('/question',
    function(req, res, next) {
        questions.showQuestions()
            .then(result => {
                res.json( {
                    result
                });
            })
            .catch(err => {

                res.json({
                    res: err.message
                })
            })
    }
);

// POST question
router.post('/question/',
    passport.authenticate('token', {session: false}),
    function(req, res, next) {
        questions.insertQuestion(req.body.user_id, req.body.title, req.body.question, req.body.keywords)
            .then(result => {
                res.json( {
                    res: "new question added",
                    id: result.insertedId
                });
            })
            .catch(err => {
                res.status(err.code);
                res.json({
                    res: err.message
                })
            })
    }
);
router.delete('/question',
    function(req, res, next) {
        questions.deleteQuestion(ObjectID(req.body.question_id))
            .then(result => {
                res.json( {
                    result
                });
            })
            .catch(err => {
                res.status(err.code);
                res.json({
                    res: err.message
                })
            })
    }
);
router.get('/question/questionsPerKeyword',
    function(req, res, next) {
        questions.findQuestionByKeywords(req.body.keywords)
            .then(result => {
                res.json( {
                    result
                });
            })
            .catch(err => {
                res.status(err.code);
                res.json({
                    res: err.message
                })
            })
    }
);

module.exports = router;
