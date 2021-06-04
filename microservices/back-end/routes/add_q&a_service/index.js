const users = require('../../models/add_q&a_service/users');
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

const jwt = require('jsonwebtoken');
const {ObjectID} = require("bson");
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const JWT_SECRET = 'top-secret';


passport.use('token', new JWTstrategy(
    {
        secretOrKey: JWT_SECRET,
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    function(token, done) {
        return done(null, { username: token.username})
    }
));


router.post('/answer',
    passport.authenticate('token', {session: false}),
    function(req, res, next) {
        const answer_obj = req.body;
        if (!mongodb.ObjectId.isValid(req.body.userId) || !mongodb.ObjectId.isValid(req.body.questionId)) {
            next(createError(404, "Not existing Question or User Id"));
        }
        else {
            answers.insertAnswer(ObjectID(req.body.userId), ObjectID(req.body.questionId), req.body.answer)
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
router.delete('/answer',
    passport.authenticate('token', {session: false}),
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

router.put('/answer',
    passport.authenticate('token', {session: false}),
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

router.put('/answer/upvote',
    passport.authenticate('token', {session: false}),
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
router.post('/question',
    passport.authenticate('token', {session: false}),
    function(req, res, next) {
        const question_obj = req.body;
        if (!mongodb.ObjectId.isValid(question_obj.userId)) {
            next(createError(404, "Not existing  User Id"));
        }
        else {
            questions.insertQuestion(ObjectID(question_obj.userId), question_obj.title, question_obj.question, question_obj.keywords)
                .then(result => {
                    console.log(result);
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
router.put('/question',
    passport.authenticate('token', {session: false}),
    function(req, res, next) {
        if (!mongodb.ObjectId.isValid(req.body.questionId)) {
            next(createError(404, "Not existing Question Id"));
        }
        else {
            questions.updateQuestion(ObjectID(req.body.questionId), req.body.title, req.body.question, req.body.keywords)
                .then(result => {
                    res.json({
                        res: "new question added",
                        id: result.insertedId
                    });
                })
                .catch(err => {
                    next(createError(err.code || 400, err.message));

                })
        }
    }
);
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
