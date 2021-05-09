const questions = require('../../models/questions_answers_service/questions');
const answers = require('../../models/detailed_q&a_service/answers');
const {OAuth2Client} = require('google-auth-library');
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
router.post('/question',
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