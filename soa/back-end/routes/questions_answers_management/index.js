const questions = require('../../models/questions_answers_management/questions');
const answers = require('../../models/questions_answers_management/answers');
const validator = require('../../middleware/payload_validator');
const {OAuth2Client} = require('google-auth-library');
const createError = require('http-errors');
const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const jwt = require('jsonwebtoken');
const {ObjectID} = require("bson");
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const JWT_SECRET = 'top-secret';

// As the service suggest, in this file there exist only apis concering the management of questions/answers

// For all of the below apis, mongodb.ObjectId.isvalid is used to check if an id
// given in the body request is valid under the rules of ObjectID (mongo's type)

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

// show all questions
// returns json with values:
// {
//      _id,
//      user_id,
//      title,
//      question_no,
//      question,
//      date,
//      keywords,
//      num_of_answers
// }

passport.use('token', new JWTstrategy(
    {
        secretOrKey: JWT_SECRET,
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    function(token, done) {
        return done(null, { username: token.username})
    }
));

// returns all answers of a specific question
// takes question_id as an argument in body of api
// returns a json with values: _id, user_id, question_id, date, answer, upvotes
const expected_question = {
    "questionId" : ""
}
const mandatory_question = ["questionId"]
router.get('/answers/question',
    passport.authenticate('token', {session: false}),
    validator.payloadValidator(expected_question, mandatory_question, true),
    function(req, res, next) {
        if (!mongodb.ObjectId.isValid(req.body.questionId)) {
            next(createError(404, "Not existing Question Id"));
        }
        else {
            answers.showAnswersforQuestion(ObjectID(req.body.questionId))
                .then(result => {
                    res.json({
                        msg: "Answers for given question id",
                        answers: result
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
const expected_user = {
    "userId" : ""
}
const mandatory_user = ["userId"]
router.get('/answers/user',
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
                        msg: "Answers for given user id",
                        answers: result
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
const expected_post_answer = {
    "userId" : "",
    "questionId" : "",
    "answer" : ""
}
const mandatory_post_answer = ["userId", "questionId", "answer"];
router.post('/answer',
    passport.authenticate('token', {session: false}),
    validator.payloadValidator(expected_post_answer, mandatory_post_answer, true),
    function(req, res, next) {
        if (!mongodb.ObjectId.isValid(req.body.userId) || !mongodb.ObjectId.isValid(req.body.questionId)) {
            next(createError(404, "Not existing Question or User Id"));
        }
        else {

            answers.insertAnswer(ObjectID(req.body.userId), req.user.username, ObjectID(req.body.questionId), req.body.answer)
                .then(result => {
                    res.json( {
                        msg: "new answer added",
                        id: result.insertedId,
                        date: result.date
                    });
                })
                .catch(err => {
                    next(createError(err.code || 400, err.message || "Something went wrong"));
                })
        }

    }
);
const expected_delete_answer = {
    "answerId" : "",
}
const mandatory_delete_answer = ["answerId"];
router.delete('/answer',
    passport.authenticate('token', {session: false}),
    validator.payloadValidator(expected_delete_answer, mandatory_delete_answer, true),
    function(req, res, next) {
        if (!mongodb.ObjectId.isValid(req.body.answerId)) {
            next(createError(404, "Not existing Answer Id"));

        }
        else {
            answers.deleteAnswer(ObjectID(req.body.answerId))
                .then(result => {
                    res.json({
                        msg: "Answer deleted successfully"
                    });
                })
                .catch(err => {
                    next(createError(err.code || 400, err.message));
                })
        }
    }
);
const expected_put_answer = {
    "answerId" : "",
    "answer" : ""
}
const mandatory_put_answer = ["answerId", "answer"];
router.put('/answer',
    passport.authenticate('token', {session: false}),
    validator.payloadValidator(expected_put_answer, mandatory_put_answer, true),
    function(req, res, next) {
        if (!mongodb.ObjectId.isValid(req.body.answerId)) {
            next(createError(404, "Not existing Answer Id"));
        }
        else {
            answers.updateAnswer(ObjectID(req.body.answerId), req.body.answer)
                .then(result => {
                    res.json({
                        msg: "Answer updated successfully"
                    });
                })
                .catch(err => {
                    next(createError(err.code || 400, err.message));

                })
        }
    }
);

const expected_payload_answer_upvote = {
    "userId" : "",
    "answerId" : ""
}
const mandatory_answer_upvote = ["userId", "answerId"];
router.put('/answer/upvote',
    passport.authenticate('token', {session: false}),
    validator.payloadValidator(expected_payload_answer_upvote, mandatory_answer_upvote, true),
    function(req, res, next) {
        if (!mongodb.ObjectId.isValid(req.body.answerId) || !mongodb.ObjectId.isValid(req.body.userId)) {
            next(createError(404, "Not existing  Answer or User Id"));
        }
        else {
            answers.upvoteAnswer(ObjectID(req.body.answerId))
                .then(result => {
                    res.json({
                        res: "Answer has a new upvote"
                    });
                })
                .catch(err => {
                    next(createError(err.code || 400, err.message));

                })
        }
    }
);

// ------------------------------------------------------ QUESTION APIS ----------------------------------------------------------


// show all questions
// returns json with values: _id, user_id, title, question_no, question, date, keywords, num_of_answers

router.get('/question',
    passport.authenticate('token', {session: false}),
    function(req, res, next) {
        questions.showQuestions()
            .then(result => {
                res.json( {
                    questions: result
                });
            })
            .catch(err => {
                next(createError(err.code || 400, err.message));

            })
    }
);

// show all questions per specific keyword
// returns questions that matches keywords given in an array
const expected_questions_keyword = {
    "keywords" : []
}
const mandatory_questions_keyword = ["keywords"];
router.get('/questions/questionsPerKeyword',
    passport.authenticate('token', {session: false}),
    validator.payloadValidator(expected_questions_keyword, mandatory_questions_keyword, true),
    function(req, res, next) {
        questions.findQuestionByKeywords(req.body.keywords)
            .then(result => {
                res.json( {
                    msg: "Questions returned by keywords",
                    questions: result
                });
            })
            .catch(err => {
                next(createError(err.code || 400, err.message));

            })
    }
);


// returns all questions that a user has made
router.get('/questions/user',
    passport.authenticate('token', {session: false}),
    validator.payloadValidator(expected_user, mandatory_user, true),
    function(req, res, next) {
        if (!mongodb.ObjectId.isValid(req.body.userId)) {
            next(createError(404, "Not existing  User Id"));
        }
        else {
            questions.findQuestionByUser(ObjectID(req.body.userId))
                .then(result => {
                    res.json({
                        msg: "Questions returned by user",
                        questions: result
                    });
                })
                .catch(err => {
                    next(createError(err.code || 400, err.message));

                })
        }
    }
);


// POST question
const expected_post_question = {
    "userId" : "",
    "title" : "",
    "question" : "",
    "keywords" : [],
}
const mandatory_post_question = ["userId", "title", "question", "keywords"];
router.post('/question',
    passport.authenticate('token', {session: false}),
    validator.payloadValidator(expected_post_question, mandatory_post_question, true),
    function(req, res, next) {
        const question_obj = req.body;
        if (!mongodb.ObjectId.isValid(question_obj.userId)) {
            next(createError(404, "Not existing  User Id"));
        }
        else {
            questions.insertQuestion(ObjectID(question_obj.userId), req.user.username, question_obj.title, question_obj.question, question_obj.keywords)
                .then(result => {
                    res.json({
                        msg: "new question added",
                        id: result.insertedId,
                        question_no: result.question_no,
                        date: result.date
                    });

                })
                .catch(err => {
                    next(createError(err.code || 400, err.message));

                })
        }
    }
);
// Update question
const expected_put_question = {
    "questionId" : "",
    "title" : "",
    "question" : "",
    "keywords" : [],
}
const mandatory_put_question = ["questionId"];
router.put('/question',
    passport.authenticate('token', {session: false}),
    validator.payloadValidator(expected_put_question, mandatory_put_question, true),
    function(req, res, next) {
        if (!mongodb.ObjectId.isValid(req.body.questionId)) {
            next(createError(404, "Not existing Question Id"));
        }
        else {
            questions.updateQuestion(ObjectID(req.body.questionId), req.body.title, req.body.question, req.body.keywords)
                .then(result => {
                    res.json({
                        msg: "new question added",
                        id: result.insertedId
                    });
                })
                .catch(err => {
                    next(createError(err.code || 400, err.message));

                })
        }
    }
);


const expected_delete_question = {
    "questionId" : ""
}
const mandatory_delete_question = ["questionId"];
router.delete('/question',
    passport.authenticate('token', {session: false}),
    validator.payloadValidator(expected_delete_question, mandatory_delete_question, true),
    function(req, res, next) {
        if (!mongodb.ObjectId.isValid(req.body.qusetionId)) {
            next(createError(404, "Not existing Question or User Id"));
        }
        else {
            questions.deleteQuestion(ObjectID(req.body.questionId))
                .then(result => {
                    res.json({
                        msg: "Question deleted successfully"
                    });
                })
                .catch(err => {
                    next(createError(err.code || 400, err.message));

                })
        }
    }
);

module.exports = router;
