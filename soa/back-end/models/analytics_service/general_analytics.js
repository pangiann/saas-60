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
    showAnswers: async function () {
        const answers_collection = client.db('q&a').collection('Answers');
        try {
            return await answers_collection.find().sort( { date: 1 } ).toArray()
        }
        catch (error) {
            throw error;
        }

    },
    answersPerUser: async function () {
        const questions_collection = client.db('q&a').collection('Answers');
        try {
            return await questions_collection.aggregate([
                {$group: {_id: "$username", no_of_answers: {$sum: 1}}},
                {$project: {_id: 0, username: "$_id", no_of_answers: 1}},
                {$sort: {no_of_answers: -1}}
            ]).toArray();
        }
        catch (error) {
            throw error;
        }

    },
    showQuestions: async function () {
        const questions_collection = client.db('q&a').collection('Questions');
        try {
            return await questions_collection.find().sort( { date: 1 } ).toArray()
        }
        catch (error) {
            throw error;
        }

    },
    questionsPerKeyword: async function () {
        const questions_collection = client.db('q&a').collection('Questions');
        try {
            return await questions_collection.aggregate([
                {$unwind: "$keywords" }, {$group: {_id: "$keywords", keyword_sum: {$sum: 1}}},
                {$project: {_id: 0, keywords: "$_id", keyword_sum: 1}},
                {$sort: {keyword_sum: -1} }
            ]).toArray();
        }
        catch (error) {
            throw error;
        }


    },
    questionsPerUser: async function () {
        const questions_collection = client.db('total_analytics').collection('Questions');
        try {
            return await questions_collection.aggregate([
                {$group: {_id: "$username", no_of_questions: {$sum: 1}}},
                {$project: {_id: 0, username: "$_id", no_of_questions: 1}},
                {$sort: {no_of_questions: -1}}

            ]).toArray();
        }
        catch (error) {
            throw error;
        }


    }
};
