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

passport.use('token', new JWTstrategy(
    {
        secretOrKey: JWT_SECRET,
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    function(token, done) {
        return done(null, { username: token.username})
    }
));

function calculate_statistics(result, first_year, last_year, tot_num_per_day, tot_num_per_month, tot_years_num) {
    const rows = last_year - first_year + 1;
    const columns = 12;
    let year = first_year;
    let i = 0, j = 0;
    while (j < result.length) {
        let curr_year = new Date(result[j].date);
        if (curr_year.getFullYear() !== year) {
            i++;
            year = (new Date(result[j].date)).getFullYear();
        }
        else {
            const month = (new Date(result[j].date)).getMonth();
            const day = (new Date(result[j].date)).getDay();

            tot_num_per_day[i][month][day]++
            tot_num_per_month[i][month]++
            j++;
        }
    }
    for (let i = 0; i < rows; i++) {
        tot_years_num[i] = tot_num_per_month[i].reduce((a, b) => a + b, 0)
    }

}


// schema of questions:
// {
//      _id:
//      username:
//      keywords:
//      date:
// }

// schema of answers:
// {
//      _id:
//      username:
//      upvotes:
//      date:
// }

// show question per user, e.g. pangiann asked 5 questions, mairi asked 3 questions etc.
// returns json in form:
// [
//      {
//          no_of_questions:
//          username:
//      }
// ]
router.get('/questionsPerUser',
    function(req, res, next) {
        questions.questionsPerUser()
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


// returns number of questions with specific keyword
// json format is:
// [
//      {
//            "keyword_sum": 3,
//            "keywords":
//      }
//]

router.get('/questionsPerKeyword',
    function(req, res, next) {
        questions.questionsPerKeyword()
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

router.get('/questionsPerDay',
    function(req, res, next) {
        questions.showQuestions()
            .then(result => {
                console.log(result[0].date)
                let first_year = (new Date(result[0].date)).getFullYear();
                let last_year = (new Date(result[result.length-1].date)).getFullYear();
                const rows = last_year - first_year + 1;
                const columns = 12;
                let tot_num_per_day = Array(rows).fill().map(() => Array(columns).fill().map(() => Array(31).fill(0)));
                let tot_num_per_month = Array(rows).fill().map(() => Array(columns).fill(0));
                let tot_years_num = new Array(rows);
                calculate_statistics(result, first_year, last_year, tot_num_per_day, tot_num_per_month, tot_years_num);


                res.json( {
                    'msg' : 'Total Questions',
                    'questions' : result,
                    'first_year' : first_year,
                    'last_year' : last_year,
                    'tot_num_per_day' : tot_num_per_day,
                    'tot_num_per_month' : tot_num_per_month,
                    'tot_years_num' : tot_years_num
                });
            })
            .catch(err => {
                next(createError(err.code || 400, err.message));

            })
    }
);

const expected_user = {
    "username" : ""
}
const mandatory_user = ["username"]
router.post('/questionsPerDay/user',
    passport.authenticate('token', {session: false}),
    validator.payloadValidator(expected_user, mandatory_user, true),
    function(req, res, next) {
        questions.showQuestionsOfUser(req.body.username)
            .then(result => {
                console.log(result[0].date)
                let first_year = (new Date(result[0].date)).getFullYear();
                let last_year = (new Date(result[result.length-1].date)).getFullYear();
                const rows = last_year - first_year + 1;
                const columns = 12;
                let tot_num_per_day = Array(rows).fill().map(() => Array(columns).fill().map(() => Array(31).fill(0)));
                let tot_num_per_month = Array(rows).fill().map(() => Array(columns).fill(0));
                let tot_years_num = new Array(rows);
                calculate_statistics(result, first_year, last_year, tot_num_per_day, tot_num_per_month, tot_years_num);


                res.json( {
                    'msg' : 'Total Questions for User',
                    'questions' : result,
                    'first_year' : first_year,
                    'last_year' : last_year,
                    'tot_num_per_day' : tot_num_per_day,
                    'tot_num_per_month' : tot_num_per_month,
                    'tot_years_num' : tot_years_num
                });
            })
            .catch(err => {
                next(createError(err.code || 400, err.message));

            })
    }
);

// show question per user, e.g. pangiann asked 5 questions, mairi asked 3 questions etc.
// returns json in form:
// [
//      {
//          no_of_answers:
//          username:
//      }
// ]
router.get('/answersPerUser',
    function(req, res, next) {
        answers.answersPerUser()
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



router.get('/answersPerDay',
    function(req, res, next) {
        answers.showAnswers()
            .then(result => {
                let first_year = (new Date(result[0].date)).getFullYear();
                let last_year = (new Date(result[result.length-1].date)).getFullYear();
                const rows = last_year - first_year + 1;
                const columns = 12;
                let tot_num = Array(rows).fill().map(() => Array(columns).fill(0));
                let tot_years_num = new Array(rows);
                calculate_statistics(result, first_year, last_year, tot_num, tot_years_num);

                res.json( {
                    'msg' : 'Total Answers',
                    'answers' : result,
                    'first_year' : first_year,
                    'last_year' : last_year,
                    'tot_num' : tot_num,
                    'tot_years_num' : tot_years_num
                });
            })
            .catch(err => {
                next(createError(err.code || 400, err.message));

            })
    }
);
module.exports = router;

