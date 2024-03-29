const MongoClient = require('mongodb').MongoClient;
const crypto = require('crypto');
const createError = require('http-errors');
// Replace the uri string with your MongoDB deployment's connection string.
const ObjectID = require('bson').ObjectID;

const myArgs = process.argv.slice(2);
console.log(myArgs)
let url;
if (myArgs[0] !== 'localhost') {
    url = process.env.MONGO_URL;
}
else  url = "mongodb://localhost:27017"
const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});

function CustomException(message, code) {
    const error = new Error(message);
    error.code = code;
    return error;
}

CustomException.prototype = Object.create(Error.prototype);
client.connect();

module.exports = {
    insertQuestion: async function (question_id, username, keywords, date) {
        const questions_collection = client.db('total_analytics').collection('Questions');
        try {
            const question_doc = {
                _id: question_id,
                username: username,
                keywords: keywords,
                date: date
            }
            const result = await questions_collection.insertOne(question_doc);
            if (result.insertedCount !== 1) {
                throw new CustomException("Question not added", 404);
            }
            return result;
        }
        catch (error) {
            throw error;
        }

    },

    showQuestions: async function () {
        const questions_collection = client.db('total_analytics').collection('Questions');
        try {
            return await questions_collection.find().sort( { date: 1 } ).toArray()
        }
        catch (error) {
            throw error;
        }

    },
    showQuestionsOfUser: async function (username) {
        const questions_collection = client.db('total_analytics').collection('Questions');
        const query = {username: username}
        try {
            return await questions_collection.find(query).sort( { date: 1 } ).toArray()
        }
        catch (error) {
            throw error;
        }

    },
    questionsPerKeyword: async function () {
        const questions_collection = client.db('total_analytics').collection('Questions');
        try {
            return await questions_collection.aggregate([
                {$unwind: "$keywords" }, {$group: {_id: "$keywords", keyword_sum: {$sum: 1}}},
                {$project: {_id: 0, keyword: "$_id", keyword_sum: 1}},
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