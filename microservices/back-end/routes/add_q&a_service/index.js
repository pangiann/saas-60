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

const google_client = new OAuth2Client("1074766905977-lm80vj56vtkl2r3qh0urnv1eeaut71ns.apps.googleusercontent.com");





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


router.post('/googlelogin',
    function(req, res, next) {
        const tokenId = req.body.tokenId;
        google_client.verifyIdToken({idToken: tokenId, audience: "1074766905977-lm80vj56vtkl2r3qh0urnv1eeaut71ns.apps.googleusercontent.com"})
            .then(response => {
                const {email_verified, name, email} = response.payload;
                if (email_verified) {
                    res.json({
                        name: name,
                        email: email,
                        token: jwt.sign({name: name}, JWT_SECRET, {expiresIn: 36000})
                    });
                }

            })
            .catch(err => {
                next(createError(err.code || 400, err.message || "Something went wrong"));
            });

    }
);
// POST signin
router.post('/signin',
    passport.authenticate('signin', {session: false}),
    function(req, res, next) {
      res.json({
          msg: "Successful login",
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
                next(createError(err.code || 400, err.message || "Something went wrong"));
            })

    }
);
router.post('/googleregister',
    function(req, res, next) {
        const tokenId = req.body.tokenId;
        google_client.verifyIdToken({idToken: tokenId, audience: "1074766905977-lm80vj56vtkl2r3qh0urnv1eeaut71ns.apps.googleusercontent.com"})
            .then(response => {
                const {email_verified, name, email} = response.payload;
                if (email_verified) {
                    const passwd = name + tokenId + email;
                    users.insertUser(name, passwd, email)
                        .then(result =>  {
                            res.json({
                                id: result.insertedId
                            });
                        })
                        .catch(err => {
                            next(createError(err.code || 400, err.message || "Something went wrong"));
                        })
                }

            })
            .catch(err => {
                next(createError(err.code || 400, err.message || "Something went wrong"));
            });


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
            .catch(err => {
                next(createError(err.code || 400, err.message || "Something went wrong"));
            })
    }
);



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
                    produce.produce_addAnswer_event(result.result.insertedId, answer_obj.userId, answer_obj.questionId, result.question_no, answer_obj.answer, result.date)
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
                    produce.produce_addQuestion_event(question_obj.userId, result.result.insertedId, result.question_no, question_obj.title, question_obj.question, question_obj.keywords, result.date)
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
