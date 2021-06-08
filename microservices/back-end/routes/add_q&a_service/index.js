const questions = require('../../models/add_q&a_service/questions');
const answers = require('../../models/add_q&a_service/answers');
const produce = require('../../models/add_q&a_service/producer')
const {OAuth2Client} = require('google-auth-library');
const createError = require('http-errors');
const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const validator = require('../../middleware/payload_validator');

const jwt = require('jsonwebtoken');
const {ObjectID} = require("bson");
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const JWT_SECRET = 'top-secret';


// As the service suggest, in this file there exist only apis concering the creation of questions/answers


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



passport.use('token', new JWTstrategy(
    {
        secretOrKey: JWT_SECRET,
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    function(token, done) {
        return done(null, { username: token.username})
    }
));

// POST NEW ANSWER
// takes question_id, user_id and answer
// returns json with answer id of inserted answer and the date

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
        const answer_obj = req.body;
        if (!mongodb.ObjectId.isValid(req.body.userId) || !mongodb.ObjectId.isValid(req.body.questionId)) {
            next(createError(404, "Not existing Question or User Id"));
        }
        else {
            answers.insertAnswer(ObjectID(req.body.userId), req.user.username, ObjectID(req.body.questionId), req.body.answer)
                .then(result => {
                    produce.produce_addAnswer_event(result.result.insertedId, answer_obj.userId, req.user.username, answer_obj.questionId, result.question_no, answer_obj.answer, result.date)
                        .then(r => {
                            console.log("result successfull")
                        })
                        .catch(err => {
                            next(createError(err.code || 500, err.message));
                        })
                    res.json( {
                        res: "new answer added",
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

// DELETE ANSWER
// takes answer id that's all and then boom answer is gone
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
                        res: "Answer deleted successfully"
                    });
                })
                .catch(err => {
                    next(createError(err.code || 400, err.message));
                })
        }
    }
);
// UPDATE AN ANSWER
// takes answerId and new answer
// returns result message
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
                        res: "Answer updated successfully"
                    });
                })
                .catch(err => {
                    next(createError(err.code || 400, err.message));

                })
        }
    }
);
// UPVOTE AN ANSWER
// takes answerId and userId of the user that did the upvote
// returns success message (or error)
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
                    produce.produce_newUpvote_event(req.body.answerId, req.body.userId, result.value.user_id)
                        .then(r => {
                            console.log("result successfull")
                        })
                        .catch(err => {
                            next(createError(err.code || 500, err.message));
                        })
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

// POST question
// takes user id , title, question and keywords
// returns id and number of inserted question , also the date that insertion happened
const expected_post_question = {
    "userId" : "",
    "title" : "",
    "question" : "",
    "keywords" : [],
}
const mandatory_post_question = ["userId", "title", "question", "keywords"];
router.post('/question',
    passport.authenticate('token', {session: false}),
    function(req, res, next) {
        const question_obj = req.body;
        if (!mongodb.ObjectId.isValid(question_obj.userId)) {
            next(createError(404, "Not existing  User Id"));
        }
        else {
            questions.insertQuestion(ObjectID(question_obj.userId), req.user.username, question_obj.title, question_obj.question, question_obj.keywords)
                .then(result => {
                    //console.log(result);
                    // SEND EVENT OF QUESTION INSERTION IN KAFKA EVENT BUS, CHECK producer.js for function implementation
                    produce.produce_addQuestion_event(question_obj.userId, req.user.username, result.result.insertedId, result.question_no, question_obj.title, question_obj.question, question_obj.keywords, result.date, 0)
                        .then(r => {
                            console.log("result successfull")
                        })
                        .catch(err => {
                            next(createError(err.code || 500, err.message));
                        })
                    res.json({
                        res: "new question added",
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
// takes question id , title, question, keywords but mandatory is only question Id
// return success/error messsage
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
                        res: "Question updated successfully"
                    });
                })
                .catch(err => {
                    next(createError(err.code || 400, err.message));

                })
        }
    }
);

// DELETE A QUESTION
// question Id is required, that's all.
const expected_delete_question = {
    "questionId" : ""
}
const mandatory_delete_question = ["questionId"];
router.delete('/question',
    function(req, res, next) {
        if (!mongodb.ObjectId.isValid(req.body.qusetionId)) {
            next(createError(404, "Not existing Question or User Id"));
        }
        else {
            questions.deleteQuestion(ObjectID(req.body.questionId))
                .then(result => {
                    res.json({
                        res: "Question deleted successfully"
                    });
                })
                .catch(err => {
                    next(createError(err.code || 400, err.message));

                })
        }
    }
);

module.exports = router;
