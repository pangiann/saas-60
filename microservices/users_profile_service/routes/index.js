const users = require('../models/users');
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



// return JSON:
// {
//   _id:
//   username:
//   email:
//   num_of_questions:
//   num_of_answers:
//   upvotes_given:
//   upvotes_received:
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

router.get('/user',
    passport.authenticate('token', {session: false}),
    function(req, res, next) {
        if (!mongodb.ObjectId.isValid(req.body.userId)) {
            next(createError(404, "Not existing User Id"));
        }
        else {
            users.showProfile(ObjectID(req.body.userId))
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



module.exports = router;