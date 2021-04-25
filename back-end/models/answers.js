const MongoClient = require('mongodb').MongoClient;
const crypto = require('crypto');
const createError = require('http-errors');
// Replace the uri string with your MongoDB deployment's connection string.

const url = "mongodb://localhost:27017";
const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
function CustomException(message, code) {
    const error = new Error(message);

    error.code = code;
    return error;
}

CustomException.prototype = Object.create(Error.prototype);

module.exports = {
    insertAnswer: async function (username,  question_no, answer) {
        await client.connect();
        const users_collection = client.db('q&a').collection('Users');
        const answers_collection = client.db('q&a').collection('Answers');
        const questions_collection = client.db('q&a').collection('Questions');
        const query = {username: username};
        const projection = { projection: {_id:1} };
        const datetime = new Date();
        try {
            const user_id = await users_collection.findOne(query, projection);
            if (user_id === null) {
                throw new CustomException("User not Found", 404);

            }
            const update_res = await questions_collection.findOneAndUpdate(
                {question_no: parseInt(question_no)},
                {$inc:{num_of_answers:1}},
                {returnOriginal: false}
            );
            if (update_res.value === null) {
                throw new CustomException("Question Not Found", 404);
            }
            const answer_doc = {
                user_id: user_id._id,
                question_id: update_res.value._id,
                question_no: question_no,
                date: datetime,
                answer: answer,
                upvotes: 0
            }
            const result = await  answers_collection.insertOne(answer_doc);
            return result;

        } catch (error) {

            throw error;

        }
    }

};