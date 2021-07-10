const createError = require('http-errors');
const express = require('express');
const router = express.Router();
const axios = require('axios');
const qs = require('qs');
const fetch = require("node-fetch");
//const React = require('react');
const myArgs = process.argv.slice(2);
//console.log(myArgs)
let qa_management_url;
let login_register_url;
let analytics_url;
let redis_url;
if (myArgs[0] === 'localhost') {
    qa_management_url = "http://localhost:3002/questionsAnswers"
    login_register_url = "http://localhost:3000/loginRegister"
    analytics_url = "http://localhost:3001/analytics"
    redis_url = "amqp://localhost"
}
else {
    console.log("hello")
    qa_management_url = "https://soa-qa-management.herokuapp.com/questionsAnswers"
    login_register_url = "https://soa-login-register.herokuapp.com/loginRegister"
    analytics_url = "https://soa-analytics.herokuapp.com/analytics"
    redis_url = process.env.REDIS_URL
}

const TotalConnections = 20
const pool = require('redis-connection-pool')('myRedisPool', {
    url: redis_url,
    max_clients: TotalConnections,
    perform_checks: false,
    database: 0
});

function CustomException(message, code) {
  const error = new Error(message);

  error.code = code;
  return error;
}





/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });


});

function pushMessages (key, field, event) {
    let currentRequestMessages;
    let newMessage = {};
    pool.hget(key, field, async (err, data) => {
        currentRequestMessages = JSON.parse(data)
        if (currentRequestMessages === null) {
            currentRequestMessages = [];
        }
        newMessage = {
            "id" : currentRequestMessages.length + 1,
            event,
            "timestamp" : Date.now()
        }
        currentRequestMessages.push(newMessage);
        pool.hset(key, field, JSON.stringify(currentRequestMessages), () => {
            console.log("OK");
        })
    })

}


router.post('/bus/qa_management',
    function(req, res, next) {
    const request_event = req.body;
    const request_name = request_event.api_route;
    const request_base_route = request_event.base_route;
    const request_method = request_event.method;
    const request_data = request_event.data;
    //pushMessages('requests', 'qa_management', request_event)
    var myHeaders = new fetch.Headers();
    if (req.headers.authorization !== undefined) {
        myHeaders.append("Authorization", req.headers.authorization)
    }
    myHeaders.append("Content-Type", "application/json");
    let requestOptions;
    if (request_method === "get" || request_method === "GET") {
        requestOptions = {
            method: request_method,
            headers: myHeaders,
            redirect: 'follow'
        }
    }
    else {
        requestOptions = {
            method: request_method,
            headers: myHeaders,
            body: request_data,
            redirect: 'follow'
        };

    }

    console.log(login_register_url + "/"  + request_name)
    fetch(qa_management_url + "/" + request_name, requestOptions)
        .then(response => response.text())
        .then(result => {
            result = JSON.parse(result)
            pushMessages(request_base_route, request_name, result);
            res.json({
                result
            })
        })
        .catch(error => {
            next(createError(error.code || 400, error.message));
            // RETRY REQUEST
        });


})


router.post('/bus/loginRegister',
    function(req, res, next) {
        const request_event = req.body;
        const request_name = request_event.api_route;
        const request_base_route = request_event.base_route;
        const request_method = request_event.method;
        const request_data  = JSON.parse(request_event.data);
        console.log(request_event.data)
        //pushMessages('requests', 'qa_management', request_event)
        console.log(request_data)

        var urlencoded = new URLSearchParams();
        console.log(request_data.username)
        for (let key in request_data) {
            urlencoded.append(key, request_data[key])
        }
        var myHeaders = new fetch.Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        var requestOptions = {
            method: request_method,
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };
        console.log(login_register_url + "/"  + request_name)
        fetch(login_register_url + "/" + request_name, requestOptions)
            .then(response => response.text())
            .then(result => {
                result = JSON.parse(result)
                pushMessages(request_base_route, request_name, result);
                res.json({
                    result
                })
            })
            .catch(error => {
                next(createError(error.code || 400, error.message));
                // RETRY REQUEST
            });
})



const request_list = ['questionsPerUser', 'questionsPerDay', 'answersPerUser', 'answersPerDay']
router.post('/bus/analytics',
    function(req, res, next) {
        console.log("hello")
        const request_event = req.body;
        const request_name = request_event.api_route;
        const request_base_route = request_event.base_route;
        const request_method = request_event.method;
        const request_data = request_event.data;
        var myHeaders = new fetch.Headers();
        console.log(req.headers);
        if (req.headers.authorization !== undefined) {

            myHeaders.append("Authorization", req.headers.authorization)
        }
        myHeaders.append("Content-Type", "application/json");
        let requestOptions;
        if (request_method === "get" || request_method === "GET") {
            requestOptions = {
                method: request_method,
                headers: myHeaders,
                redirect: 'follow'
            }
        }
        else {
            requestOptions = {
                method: request_method,
                headers: myHeaders,
                body: request_data,
                redirect: 'follow'
            };

        }
        console.log(requestOptions);

        console.log(analytics_url + "/"  + request_name)
        fetch(analytics_url + "/" + request_name, requestOptions)
            .then(response => response.text())
            .then(result => {
                result = JSON.parse(result)
                //pushMessages(request_base_route, request_name, result);
                res.json({
                    result
                })
            })
            .catch(error => {
                next(createError(error.code || 400, error.message));
                // RETRY REQUEST
            });


})

module.exports = router;
