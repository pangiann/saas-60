const createError = require('http-errors');
const fetch = require("node-fetch");

const axios = require('axios');

(async () => {
    try {
        var myHeaders = new fetch.Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        let urlencoded = new URLSearchParams();
        urlencoded.append("data", JSON.stringify({username: "pan", password: "1234"}))
        urlencoded.append("base_route", "loginRegister")
        urlencoded.append("method", "post");
        urlencoded.append("api_route", "signin")
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };


        fetch("https://soa-event-bus.herokuapp.com/bus/loginRegister", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));


    } catch(err) {
        console.error(err);
    }
})();