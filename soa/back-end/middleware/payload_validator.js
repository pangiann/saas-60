
const payloadCheck = require('payload-validator');
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

function CustomException(message, code) {
    const error = new Error(message);
    error.code = code;
    return error;
}

CustomException.prototype = Object.create(Error.prototype);
module.exports = {
    payloadValidator: function (expected_payload, mandatory_values, blank_value_flag) {
        return (req, res, next) => {
            if (req.body) {
                const result = payloadCheck.validator(req.body, expected_payload, mandatory_values, blank_value_flag)
                if (result.success) {
                    next();
                } else {
                    res.status(400).send(result.response.errorMessage)
                }

            } else {
                res.status(400).send("Payload is not valid")
            }
        }
    }
};