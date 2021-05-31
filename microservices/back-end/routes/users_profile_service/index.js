const users = require('../../models/users_profile_service/users');
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

const google_client = new OAuth2Client("1074766905977-lm80vj56vtkl2r3qh0urnv1eeaut71ns.apps.googleusercontent.com");

/*
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
*/

/*
router.post('/user'

)

router.get('/user'

)

router.put('/user'

)

router.delete('/user'

)

router.delete( '/user/questions',
    )

*/
router.put('/user/questions',
    passport.authenticate('token', {session: false}),
    function(req, res, next) {
        let questionId = req.body.questionId;
        if (!mongodb.ObjectId.isValid(req.body.userId)) {
            next(createError(404, "Not existing User Id"));
        }
        if (questionId !== undefined ) {
            if (!mongodb.ObjectId.isValid(questionId))
                next(createError(404, "Not existing Question Id"));
            else questionId = ObjectID(questionId);

        }

        users.addNewQuestion(ObjectID(req.body.userId), questionId, req.body.title, req.body.keywords)
            .then(result => {
                res.json({
                    res: "New question added successfully"
                });
            })
            .catch(err => {
                next(createError(err.code || 400, err.message));

            })

    }
);

router.get('/user/questions',
    passport.authenticate('token', {session: false}),
    function(req, res, next) {
        if (!mongodb.ObjectId.isValid(req.body.userId)) {
            next(createError(404, "Not existing User Id"));
        }
        else {
            users.showQuestions(ObjectID(req.body.userId))
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
router.get('/user/answers',
    passport.authenticate('token', {session: false}),
    function(req, res, next) {
        if (!mongodb.ObjectId.isValid(req.body.userId)) {
            next(createError(404, "Not existing User Id"));
        }
        else {
            users.showAnswers(ObjectID(req.body.userId))
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

router.put('/user/answers',
    passport.authenticate('token', {session: false}),
    function(req, res, next) {
        let answerId = req.body.answerId;
        console.log(req.body.questionId);
        if (!mongodb.ObjectId.isValid(req.body.userId) || !mongodb.ObjectId.isValid(req.body.questionId)) {
            next(createError(404, "Not existing User or Question Id"));
        }
        if (answerId !== undefined ) {
            if (!mongodb.ObjectId.isValid(answerId))
                next(createError(404, "Not existing Question Id"));
            else answerId = ObjectID(answerId);

        }

        users.addNewAnswer(ObjectID(req.body.userId), ObjectID(req.body.questionId), answerId, req.body.answer, req.body.upvotes)
            .then(result => {
                res.json({
                    res: "New answer added successfully"
                });
            })
            .catch(err => {
                next(createError(err.code || 400, err.message));

            })

    }
);
module.exports = router;