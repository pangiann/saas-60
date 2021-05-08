const users = require('../../models/detailed_q&a_service/users');
const questions = require('../../models/detailed_q&a_service/questions');
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
                res.status(400);
                res.json({
                    res: err.message
                });
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
                res.status(400);
                res.json( {
                   msg: err.message
                });
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
                    //const jwt_token = jwt.sign({name: name}, JWT_SECRET, {expiresIn: 36000})
                    const passwd = name + tokenId + email;
                    users.insertUser(name, passwd, email)
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

            })
            .catch(err => {
                res.status(400);
                res.json({
                    res: err.message
                });
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
            .catch(err =>
                res.json({
                    res: err.message
                })
            );
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
