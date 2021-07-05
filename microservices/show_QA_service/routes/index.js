const questions = require('../models/questions');
const answers = require('../models/answers');
const {OAuth2Client} = require('google-auth-library');
const createError = require('http-errors');
const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const validator = require('../middleware/payload_validator');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

const jwt = require('jsonwebtoken');
const {ObjectID} = require("bson");
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const JWT_SECRET = 'top-secret';


// As the service suggest, in this file there exist only apis concering the appearance of questions/answers
// in various constraints, circumstances etc.

// For all of the below apis, mongodb.ObjectId.isvalid is used to check if an id
// given in the body request is valid under the κανόνες of ObjectID (mongo's type)


// schema of questions:
// {
//      _id:
//      user_id:
//      title:
//      question_no:
//      question:
//      date:
//      keywords:
//      num_of_answers:
// }

// schema of answers:
// {
//      _id:
//      user_id:
//      question_id:
//      date:
//      answer:
//      upvotes:
// }

// FORM OF APIS  is the same:
// 1) we call a function(query in database) from models folder
// 2) we wait for the result and send it back
passport.use('token', new JWTstrategy(
    {
        secretOrKey: JWT_SECRET,
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    function(token, done) {
        return done(null, { username: token.username})
    }
));
// show all questions
// returns json with values: _id, user_id, title, question_no, question, date, keywords, num_of_answers
router.get('/question',
    function(req, res, next) {
        questions.showQuestions()
            .then(result => {
                res.json( {
                    result
                });
            })
            .catch(err => {
                next(createError(err.code || 400, err.message));

            })
    }
);


// returns question of a specific question_id
// takes question_id as an argument in body of api
// returns a json with values: _id, user_id, question_id, date, answer, upvotes

const expected_question = {
    "questionId" : ""
}
const mandatory_question = ["questionId"]
router.post('/questions/question_id',
    validator.payloadValidator(expected_question, mandatory_question, true),
    function(req, res, next) {
        if (!mongodb.ObjectId.isValid(req.body.questionId)) {
            next(createError(404, "Not existing Question Id"));
        }
        else {
            questions.showSpecificQuestion(ObjectID(req.body.questionId))
                .then(result => {
                    res.json({
                        result
                    });
                })
                .catch(err => {
                    next(createError(err.code || 400, err.message));

                })
        }
    }
);

// show all questions per specific keyword
// returns questions that matches keywords given in an array
const expected_questions_keyword = {
    "keywords" : []
}
const mandatory_questions_keyword = ["keywords"];
router.post('/questions/questionsPerKeyword',
    validator.payloadValidator(expected_questions_keyword, mandatory_questions_keyword, true),
    function(req, res, next) {
        questions.findQuestionByKeywords(req.body.keywords)
            .then(result => {
                res.json( {
                    result
                });
            })
            .catch(err => {
                next(createError(err.code || 400, err.message));

            })
    }
);
const expected_user = {
    "userId" : ""
}
const mandatory_user = ["userId"]
// returns all questions that a user has made
router.post('/questions/user',
    validator.payloadValidator(expected_user, mandatory_user, true),
    function(req, res, next) {
        if (!mongodb.ObjectId.isValid(req.body.userId)) {
            next(createError(404, "Not existing  User Id"));
        }
        else {
            questions.findQuestionByUser(ObjectID(req.body.userId))
                .then(result => {
                    res.json({
                        result
                    });
                })
                .catch(err => {
                    next(createError(err.code || 400, err.message));

                })
        }
    }
);

// returns all answers of a specific question
// takes question_id as an argument in body of api
// returns a json with values: _id, user_id, question_id, date, answer, upvotes

router.post('/answers/question',
    validator.payloadValidator(expected_question, mandatory_question, true),
    function(req, res, next) {
        if (!mongodb.ObjectId.isValid(req.body.questionId)) {
            next(createError(404, "Not existing Question Id"));
        }
        else {
            answers.showAnswersforQuestion(ObjectID(req.body.questionId))
                .then(result => {
                    res.json({
                        result
                    });
                })
                .catch(err => {
                    next(createError(err.code || 400, err.message));

                })
        }
    }
);

// show all answers made by a user
// takes user_id as an argument

router.post('/answers/user',
    passport.authenticate('token', {session: false}),
    validator.payloadValidator(expected_user, mandatory_user, true),
    function(req, res, next) {
        if (!mongodb.ObjectId.isValid(req.body.userId)) {
            next(createError(404, "Not existing  User Id"));
        }
        else {
            answers.showAnswersforUser(ObjectID(req.body.userId))
                .then(result => {
                    res.json({
                        result
                    });
                })
                .catch(err => {
                    next(createError(err.code || 400, err.message));

                })
        }
    }
);

// returns all answers
router.get('/answer',
    passport.authenticate('token', {session: false}),
    function(req, res, next) {
        answers.showAnswers()
            .then(result => {
                res.json( {
                    answers: result
                });
            })
            .catch(err => {
                next(createError(err.code || 400, err.message || "Something went wrong"));
            })
    }
);
module.exports = router;