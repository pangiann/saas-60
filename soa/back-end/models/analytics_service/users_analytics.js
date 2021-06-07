const MongoClient = require('mongodb').MongoClient;
const crypto = require('crypto');
const createError = require('http-errors');
// Replace the uri string with your MongoDB deployment's connection string.
const ObjectID = require('bson').ObjectID;
const url = "mongodb://localhost:27017";
const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});

function CustomException(message, code) {
    const error = new Error(message);
    error.code = code;
    return error;
}

CustomException.prototype = Object.create(Error.prototype);
client.connect();

module.exports = {

    usersNoOfQuestions: async function (user_id) {
        const questions_collection = client.db('q&a').collection('Questions');
        try {
            return  await questions_collection.aggregate([
                { $match: { user_id: user_id } },
                { $group: {_id: "$user_id", no_of_questions: { $sum: 1 } } },
                { $project: {_id: 0, username: 1, user_id: "$_id", no_of_questions: 1 } }
            ]).toArray();
        }
        catch (error) {
            throw error;
        }

    },
    usersNoOfAnswers: async function (user_id) {
        const answers_collection = client.db('q&a').collection('Answers');
        try {
            return  await answers_collection.aggregate([
                { $match: { user_id: user_id } },
                { $group: {_id: "$user_id", no_of_answers: { $sum: 1 } } },
                { $project: {_id: 0, user_id: "$_id", no_of_answers: 1 } }
            ]).toArray();
        }
        catch (error) {
            throw error;
        }

    },
    upvotesReceived: async function (user_id) {
        const answers_collection = client.db('q&a').collection('Answers');
        try {
            return await answers_collection.aggregate([
                { $match: { user_id: user_id } },
                { $group: {_id: "$user_id", total_upvotes: { $sum: "$upvotes" } } },
                { $project: {_id: 0, user_id: "$_id", total_upvotes: 1 } }
            ]).toArray();
        }
        catch (error) {
            throw error;
        }
    }
};