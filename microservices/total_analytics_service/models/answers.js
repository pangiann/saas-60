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
    insertAnswer: async function (answer_id, username, upvotes, date) {
        const answers_collection = client.db('total_analytics').collection('Answers');
        try {
            const question_doc = {
                _id: answer_id,
                username: username,
                upvotes: upvotes,
                date: date
            }
            const result = await answers_collection.insertOne(question_doc);
            if (result.insertedCount !== 1) {
                throw new CustomException("Question not added", 404);
            }
            return result;
        }
        catch (error) {
            throw error;
        }
    },
    showAnswers: async function () {
        const answers_collection = client.db('total_analytics').collection('Answers');
        try {
            return await answers_collection.find().sort( { date: 1 } ).toArray()
        }
        catch (error) {
            throw error;
        }

    },
    answersPerUser: async function () {
        const questions_collection = client.db('total_analytics').collection('Answers');
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
    updateNoUpvotes: async function (answer_id) {
        const answers_collection = client.db('total_analytics').collection('Answers');
        const query = {_id: answer_id};
        const new_value = {$inc: {upvotes_given: 1}};
        try {
            const result = await answers_collection.updateOne(query, new_value);
            if (result.modifiedCount === 0) {
                throw new CustomException("Answer Not found", 404);
            }
            return {
                result
            }
        }
        catch (error) {
            throw error;
        }
    }
};