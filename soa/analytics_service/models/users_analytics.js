const MongoClient = require('mongodb').MongoClient;
const crypto = require('crypto');
const createError = require('http-errors');
const ObjectID = require('bson').ObjectID;
// Replace the uri string with your MongoDB deployment's connection string.
const myArgs = process.argv.slice(2);
let url;
if (myArgs[0] !== 'localhost') {
    url = process.env.MONGO_URL;
}
else  url = "mongodb://localhost:27017/"
const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});

function CustomException(message, code) {
    const error = new Error(message);
    error.code = code;
    return error;
}

CustomException.prototype = Object.create(Error.prototype);
client.connect();

module.exports = {

    usersProfile: async function (user_id) {
        const questions_collection = client.db('q&a').collection('Questions');
        const answers_collection = client.db('q&a').collection('Answers');
        const users_collection = client.db('q&a').collection('Users');
        try {
            const res1 = await questions_collection.aggregate([
                { $match: { user_id: user_id } },
                { $group: {_id: "$user_id", no_of_questions: { $sum: 1 } } },
                { $project: {_id: 0, username: 1, user_id: "$_id", no_of_questions: 1 } }
            ]).toArray();
            const res2 = await answers_collection.aggregate([
                { $match: { user_id: user_id } },
                { $group: {_id: "$user_id", no_of_answers: { $sum: 1 } } },
                { $project: {_id: 0, user_id: "$_id", no_of_answers: 1 } }
            ]).toArray();
            const res3 = await answers_collection.aggregate([
                { $match: { user_id: user_id } },
                { $group: {_id: "$user_id", total_upvotes: { $sum: "$upvotes" } } },
                { $project: {_id: 0, user_id: "$_id", total_upvotes: 1 } }
            ]).toArray();
            const query = {_id: user_id}
            const user_info = await users_collection.find(query).toArray();
            console.log(user_info)
            return {
                "username" : user_info[0].username,
                "email" : user_info[0].email,
                "num_of_questions" : res1[0].no_of_questions,
                "num_of_answers" : res2[0].no_of_answers,
                "upvotes_received" : res3[0].total_upvotes
            }


        }
        catch (error) {
            throw error;
        }

    }
};