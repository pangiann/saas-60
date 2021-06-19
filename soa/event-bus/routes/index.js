const createError = require('http-errors');
const express = require('express');
const router = express.Router();
const axios = require('axios');

const TotalConnections = 20
const pool = require('redis-connection-pool')('myRedisPool', {
    url: process.env.REDIS_URL,
    max_clients: TotalConnections,
    perform_checks: false,
    database: 0
});

function CustomException(message, code) {
  const error = new Error(message);

  error.code = code;
  return error;
}
const qa_management_url = "https://soa-qa-management.herokuapp.com/"
const login_register_url = "https://login-register-service.herokuapp.com/"
const analytics_url = "https://soa-analytics.herokuapp.com/"
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
    const config = {
        method: request_method,
        url: qa_management_url + request_base_route + "/" + request_name,
        headers: {
            'Authorization': req.headers.authorization,
            'Content-Type': 'application/json'
        },
        data : request_data
    };
    pool.hget(request_base_route, request_name, async (err, data) => {
        let currentMessages = JSON.parse(data);
        if (currentMessages === null || (request_method !== 'get' && request_name !== 'question')) {
            axios(config)
                .then(function (response) {
                    const json_response = response.data;
                    //console.log(json_response);
                    pushMessages(request_base_route, request_name, json_response);
                    res.json({
                        result: json_response
                    })
                })
                .catch(function (error) {
                    next(createError(error.code || 400, error.message));
                    // RETRY REQUEST
                });

        }
        else {
            res.json({
                result: currentMessages[currentMessages.length - 1].event
            })
        }
    })





})
router.post('/bus/loginRegister',
    function(req, res, next) {
        const request_event = req.body;
        const request_name = request_event.api_route;
        const request_base_route = request_event.base_route;
        const request_method = request_event.method;
        const request_data = request_event.data;
        //pushMessages('requests', 'qa_management', request_event)
        const config = {
            method: request_method,
            url: login_register_url + request_base_route + "/" + request_name,
            headers: {
                'Authorization': req.headers.authorization,
                'Content-Type': 'application/json'
            },
            data : request_data
        };
        axios(config)
            .then(function (response) {
                const json_response = response.data;
                //console.log(json_response);
                pushMessages(request_base_route, request_name, json_response);
                res.json({
                    result: json_response
                })
            })
            .catch(function (error) {
                next(createError(error.code || 400, error.message));
                // RETRY REQUEST
            });
})
const request_list = ['questionsPerUser', 'questionsPerDay', 'questionsPerKeyword', 'answersPerUser', 'answersPerDay']
router.post('/bus/analytics',
    function(req, res, next) {
        const request_event = req.body;
        const request_name = request_event.api_route;
        const request_base_route = request_event.base_route;
        const request_method = request_event.method;
        const request_data = request_event.data;
        //pushMessages('requests', 'qa_management', request_event)
        const config = {
            method: request_method,
            url: analytics_url + request_base_route + "/" + request_name,
            headers: {
                'Authorization': req.headers.authorization,
                'Content-Type': 'application/json'
            },
            data : request_data
        };
        pool.hget(request_base_route, request_name, async (err, data) => {
            let currentMessages = JSON.parse(data);
            if (currentMessages === null || (request_method !== 'get' && !request_list.includes(request_name))) {
                axios(config)
                    .then(function (response) {
                        const json_response = response.data;
                        //console.log(json_response);
                        pushMessages(request_base_route, request_name, json_response);
                        res.json({
                            result: json_response
                        })
                    })
                    .catch(function (error) {
                        next(createError(error.code || 400, error.message));
                        // RETRY REQUEST
                    });

            }
            else {
                res.json({
                    result: currentMessages[currentMessages.length - 1].event
                })
            }
        })

})

module.exports = router;
