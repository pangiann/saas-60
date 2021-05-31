const MongoClient = require('mongodb').MongoClient;
const crypto = require('crypto');
const createError = require('http-errors');
const BSON = require('bson');
const {ObjectID} = require("bson");

// Replace the uri string with your MongoDB deployment's connection string.

const url = "mongodb://localhost:27017";
const client = new MongoClient(url, {useNewUrlParser: true,  useUnifiedTopology: true});
client.connect();
function CustomException(message, code) {
    const error = new Error(message);
    error.code = code;
    return error;
}



// function to update number of questions
// in 10000 years an overflow is highly probable to occur but who cares,
// I'll not even exist until then, so good luck with the next ones
CustomException.prototype = Object.create(Error.prototype);
async function getNextSequenceValue(questions_collection, sequenceName){
    const sequenceDocument = await questions_collection.findOneAndUpdate(
        {_id: sequenceName},
        {$inc:{seqValue:1}},
        {returnOriginal: false}
    );
    return sequenceDocument.value.seqValue;
}

module.exports = {
    // Here an event produced in the kafka bus by add_q&a service where a new question is added
    // so, we have already q question_id, user_id, question_no, answer and date for this
    // we create the document and insert it in the database
    insertQuestion: async function (user_id,  question_id, title, question, question_no, date, keywords) {
        const questions_collection = client.db('questions_answers_only').collection('Questions');
        try {
            const question_doc = {
                _id: question_id,
                user_id: user_id,
                title: title,
                question_no: question_no,
                question: question,
                date: date,
                keywords: keywords,
                num_of_answers: 0
            }
            const result = await  questions_collection.insertOne(question_doc);

            // In the result of insertOne() function there is a field called insertedCount that is returned from mongodb
            // With this value we could check if everything did go well (specifically insertedCount should be equal to 1)
            // or else we should throw an error with 404 code
            if (result.insertedCount !== 1) {
                throw new CustomException("Question insertion failed", 404);
            }
            return result;
        } catch (error) {
            throw error;
        }

    },
    showQuestions: async function () {
        try {
            const questions_collection = client.db('questions_answers_only').collection('Questions');
            const result = await questions_collection.find().toArray();

            return result;
        }
        catch (error) {
            throw error;
        }



    },
    deleteQuestion: async function (question_id) {
        const query = {_id: question_id};
        try {
            const questions_collection = client.db('questions_answers_only').collection('Questions');
            const result = await questions_collection.deleteOne(query);
            //console.log(result);
            if (result.deletedCount === 0) {
                throw new CustomException("Question Not Found", 404);
            }

        }
        catch (error) {
            throw error;
        }
    },

    // mongo has a nice way to compare
    findQuestionByKeywords: async function (keyword_array) {
        const query = {keywords: {$in: keyword_array } };
        console.log(keyword_array);
        try {
            const questions_collection = client.db('questions_answers_only').collection('Questions');
            const result = await questions_collection.find(query).toArray();
            console.log(result);
            if (result.length === 0) {
                throw new CustomException("No questions found with these keywords", 404);
            }
            return result;
        }
        catch (error) {
            throw error;
        }
    },
    findQuestionByUser: async function (user_id) {
        const query = {_id: user_id};
        try {

            const questions_collection = client.db('questions_answers_only').collection('Questions');
            const result = await questions_collection.find(query).toArray();
            console.log(result);
            if (result.length === 0) {
                throw new CustomException("No questions found with this user id", 404);
            }
            return result;
        }
        catch (error) {
            throw error;
        }

    }

};