const createError = require('http-errors');

const axios = require('axios');

(async () => {
    try {
        const val = {
            userId : "60b21aefba2f98223c4021be"
        }
        // Publish a message
        const message_doc = {
            base_route: "analytics",
            api_route: "questionsPerDay",
            method: "get",
            data: {}
        }
        const config = {
            method: 'post',
            url: 'https://soa-event-bus.herokuapp.com/bus/analytics',
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBhbmF0aGEiLCJpYXQiOjE2MjQxMTc2MTUsImV4cCI6MTYyNDE1MzYxNX0.sjCKMRYqqBVP80qulD7fj1UO3QdG_-fvhaOEX6HtMpE',
                'Content-Type': 'application/json'
            },
            data: message_doc
        };

        axios(config)
            .then(function (response) {
                const json_value = response.data.result;
                //const questions = json_value.questions;
                console.log(json_value)

            })
            .catch(function (error) {
                console.log(error.response.status);

            });

    } catch(err) {
        console.error(err);
    }
})();