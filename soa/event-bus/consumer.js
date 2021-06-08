const createError = require('http-errors');
const express = require('express');
const router = express.Router();
const axios = require('axios');
const amqp = require('amqplib/callback_api');
const Broker = require('rascal').BrokerAsPromised;
const config = require('./config');

function CustomException(message, code) {
    const error = new Error(message);

    error.code = code;
    return error;
}
CustomException.prototype = Object.create(Error.prototype);

(async () => {
    try {
        const broker = await Broker.create(config);
        broker.on('error', console.error);
        let attempts = 0;
        // Consume a message
        const subscription = await broker.subscribe('events_subscriber');
        subscription.on('message', (message, content, ackOrNack) => {
            const data = JSON.parse(content.value);
            const api_base_route = content.base_route;
            if (api_base_route === 'questionsAnswers') {
                const config = {
                    method: content.method,
                    url: "http://localhost:5000/" + api_base_route + "/" + content.api_route,
                    headers: {
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBhbmF0aGEiLCJpYXQiOjE2MjMwMDczODMsImV4cCI6MTYyMzA0MzM4M30.xMMMQo4kyOaFIJi1xUCSHq-nizK9Bhn52pbAPmDRRUc',
                        'data': data

                    }
                };

                axios(config)
                    .then(async function (response) {
                        ackOrNack();
                        res.json( {
                            result: JSON.stringify(response.data)
                        })
                    })
                    .catch(function (error) {
                        console.log(error);
                        attempts++;
                        if (attempts >= 10)
                            ackOrNack()
                        else {
                            ackOrNack(error, { strategy: 'nack', defer: 1000, requeue: true})
                        }
                    });


            }
            else if (api_base_route === 'loginRegister') {

            }
            else if (api_base_route === 'analytics') {

            }

        }).on('error', err => {
            console.error('Subscriber error', err);
        }).on('invalid_content', (err, message, ackOrNack) => {
            console.error('Invalid content', err)
            ackOrNack(err, { strategy: 'nack', defer: 1000, requeue: true})
        }).on('redeliveries_exceeded', (err, message, ackOrNack) => {
            console.error('Redeliveries exceeded', err)
            ackOrNack(err)
        })
    } catch(err) {
        console.error(err);
    }
})();