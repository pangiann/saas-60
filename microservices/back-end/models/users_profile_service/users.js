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
    insertUser: async function (user_id, username, email) {
        const users_collection = client.db('users_profile').collection('Users');
        const user_doc = {
            _id: ObjectID(user_id),
            username: username,
            email: email,
            num_of_questions: 0,
            num_of_answers: 0,
            upvotes_given: 0,
            upvotes_received: 0
        };
        try {

            const result = await users_collection.insertOne(user_doc);
            if (result.insertedCount !== 1) {
                throw new CustomException("Something went wrong and insert failed", 400);
            }
            return result;

        }
        catch (error) {
            throw error;
        }

    },
    showProfile: async function (user_id) {
        try {
            const users_collection = client.db('users_profile').collection('Users');
            const query = {_id: user_id};
            const result = await users_collection.find(query).toArray();

            if (result.length === 0) {
                throw new CustomException("User not found", 404)
            }
            return result[0];
        }
        catch (error) {
            throw error;
        }
    },
    updateNoQuestions: async function (user_id) {
        const users_collection = client.db('users_profile').collection('Users');
        const query = {_id: ObjectID(user_id)};
        const new_value = {$inc: {num_of_questions: 1}};
        try {
            const result = await users_collection.updateOne(query, new_value);
            if (result.modifiedCount === 0) {
                throw new CustomException("User Not Found", 404);
            }
            return result;

        }
        catch (error) {
            throw error;
        }
    },
    updateNoAnswers: async function (user_id) {
        const users_collection = client.db('users_profile').collection('Users');
        const query = {_id:ObjectID(user_id)};
        const new_value = {$inc: {num_of_answers: 1}};
        try {
            const result = await users_collection.updateOne(query, new_value);
            if (result.modifiedCount === 0) {
                throw new CustomException("Question Not Found", 404);
            }
            return result;

        }
        catch (error) {
            throw error;
        }

    },
    updateNoUpvotes: async function (user_id_given, user_id_received) {
        const users_collection = client.db('users_profile').collection('Users');
        const query = {_id: ObjectID(user_id_given)};
        const new_value = {$inc: {upvotes_given: 1}};
        const query2 = {_id: ObjectID(user_id_received)};
        const new_value2 = {$inc: {upvotes_received: 1}};
        try {
            const given = await users_collection.updateOne(query, new_value);
            if (given.modifiedCount === 0) {
                throw new CustomException("User Not found", 404);
            }
            const received = await users_collection.updateOne(query2, new_value2);
            if (received.modifiedCount === 0) {
                throw new CustomException("User Not Found", 404);
            }
            return {
                upvotes_given: given,
                upvotes_received: received
            }

        }
        catch (error) {
            throw error;
        }

    }

};
