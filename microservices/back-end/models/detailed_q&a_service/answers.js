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
client.connect();

module.exports = {
    insertAnswer: async function (user_id,  question_id, answer) {
        const answers_collection = client.db('q&a').collection('Answers');
        const users_collection = client.db('q&a').collection('Users');
        const questions_collection = client.db('q&a').collection('Questions');

        const projection = { projection: {_id:1} };
        const datetime = new Date();
        try {
            const query = {_id: user_id};
            const user_id_returned = await users_collection.findOne(query, projection);
            if (user_id_returned === null) {
                throw new CustomException("User not Found", 404);

            }
            const update_res = await questions_collection.findOneAndUpdate(
                {_id: question_id},
                {$inc:{num_of_answers:1}},
                {returnOriginal: false}
            );
            console.log(update_res);
            if (update_res.value === null) {
                throw new CustomException("Question Not Found", 404);
            }
            const answer_doc = {
                user_id: user_id,
                question_id: update_res.value._id,
                date: datetime,
                answer: answer,
                upvotes: 0
            }
            const result = await  answers_collection.insertOne(answer_doc);
            return result;

        } catch (error) {

            throw error;

        }
    },
    showAnswersforQuestion: async function (question_id) {
        try {
            const query = {question_id: question_id};
            const answers_collection = client.db('q&a').collection('Answers');
            const result = await answers_collection.find(query).toArray();
            return result;
        }
        catch (error) {
            throw error;
        }
    },
    showAnswersforUser: async function (user_id) {
        try {
            const query = {user_id: user_id};
            const answers_collection = client.db('q&a').collection('Answers');
            const result = await answers_collection.find(query).toArray();
            return result;
        }
        catch (error) {
            throw error;
        }
    },
    deleteAnswer: async function (answer_id) {
        const query = {_id: answer_id};
        try {
            const answers_collection = client.db('q&a').collection('Answers');
            const result = await answers_collection.deleteOne(query);
            console.log(result);
            if (result.deletedCount === 0) {
                throw new CustomException("Answer Not Found", 404);
            }

        }
        catch (error) {
            throw error;
        }
    },
    updateAnswer: async function (answer_id, new_answer) {
        const datetime = new Date();
        try {
            const answers_collection = client.db('q&a').collection('Answers');
            const query = {_id: answer_id};
            const newValues = {
                $set: {
                    date: datetime,
                    answer: new_answer

                }
            };
            const result = await  answers_collection.updateOne(query, newValues);
            if (result.modifiedCount === 0) {
                throw new CustomException("Answer Not Found", 404);
            }
            return result;
        } catch (error) {
            throw error;
        }


    }

};