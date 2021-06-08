const MongoClient = require('mongodb').MongoClient;
const crypto = require('crypto');
const createError = require('http-errors');
const {ObjectID} = require("bson");
// Replace the uri string with your MongoDB deployment's connection string.

const url = "mongodb+srv://pangiann:panatha4ever@saas-60.7e7gc.mongodb.net/test?authSource=admin&replicaSet=atlas-o23qsd-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
function CustomException(message, code) {
    const error = new Error(message);

    error.code = code;
    return error;
}

CustomException.prototype = Object.create(Error.prototype);
client.connect();


// PREPEI NA TA TESTARW TA QUERIA AYTA, DEN EXOYN TESTARISTEI STO FOYL
// PROSOXI RE MALAKA


module.exports = {
    // Here an event produced in the kafka bus by add_q&a service where a new answer is added
    // so, we have already answer_id, question_id, user_id, question_no, answer and date for this
    // we create the document, we increment by one value :no_of_answers in questions' document
    insertAnswer: async function (answer_id, question_id, user_id, username, question_no, answer, date) {
        const answers_collection = client.db('questions_answers_only').collection('Answers');
        const questions_collection = client.db('questions_answers_only').collection('Questions');
        try {
            // increment by one no_of_answers
            const update_res = await questions_collection.findOneAndUpdate(
                {_id: question_id},
                {$inc:{num_of_answers:1}},
                {returnOriginal: false}
            );
            // return new document and check if is null in order to throw an error cause probably question doesn't exist
            if (update_res.value === null) {
                throw new CustomException("Question Not Found", 404);
            }

            // answer document is created and inserted in database
            const answer_doc = {
                _id: answer_id,
                user_id: user_id,
                username: username,
                question_id: update_res.value._id,
                date: date,
                answer: answer,
                upvotes: 0
            }
            const result = await  answers_collection.insertOne(answer_doc);

            // if everything goes right value of insertedCount should be equal to 1
            if (result.insertedCount !== 1) {
                throw new CustomException("Insertion failed", 400);
            }
            return result;

        } catch (error) {

            throw error;

        }
    },
    // pretty straightforward , query answers by question_id
    // find(query) function is used
    showAnswersforQuestion: async function (question_id) {
        try {
            const query = {question_id: question_id};
            const answers_collection = client.db('questions_answers_only').collection('Answers');
            // toArray() is used to prettify the answer and convert to json
            const result = await answers_collection.find(query).toArray();

            // if length of result is zero it means that no answers found for this question_id, so return 404 error
            if (result.length === 0) {
                throw new CustomException("No answers found for this question id", 404);
            }
            return result;
        }
        catch (error) {
            throw error;
        }
    },
    showAnswersforUser: async function (user_id) {
        try {
            const query = {user_id: user_id};
            const answers_collection = client.db('questions_answers_only').collection('Answers');
            const result = await answers_collection.find(query).toArray();
            if (result === null) {
                throw new CustomException("No answers for this user", 400);
            }
            return result;
        }
        catch (error) {
            throw error;
        }
    },
    showAnswers: async function () {
        try {
            const questions_collection = client.db('q&a').collection('Answers');
            const result = await questions_collection.find().toArray();
            if (result.length === 0) {
                throw new CustomException("No answers found", 404);

            }
            return result;
        }
        catch (error) {
            throw error;
        }



    },
    deleteAnswer: async function (answer_id) {
        const query = {_id: answer_id};
        try {
            const answers_collection = client.db('questions_answers_only').collection('Answers');
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
    updateNoUpvotes: async function (answer_id) {
        const answers_collection = client.db('questions_answers_only').collection('Answers');
        const query = {_id: answer_id};
        const new_value = {$inc: {upvotes: 1}};
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
    },
    updateAnswer: async function (answer_id, new_answer) {
        const datetime = new Date();
        try {
            const answers_collection = client.db('questions_answers_only').collection('Answers');
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