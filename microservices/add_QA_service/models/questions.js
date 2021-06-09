// noinspection ExceptionCaughtLocallyJS

const MongoClient = require('mongodb').MongoClient;
const crypto = require('crypto');
const createError = require('http-errors');
const BSON = require('bson');

// Replace the uri string with your MongoDB deployment's connection string.
const myArgs = process.argv.slice(2);
let url;
if (myArgs[0] !== 'localhost') {
    url = process.env.MONGO_URL;
}
else  url = "mongodb://localhost:27017/"
const client = new MongoClient(url, {useNewUrlParser: true,  useUnifiedTopology: true});
client.connect();
function CustomException(message, code) {
    const error = new Error(message);

    error.code = code;
    return error;
}

CustomException.prototype = Object.create(Error.prototype);


async function getNextSequenceValue(questions_collection, sequenceName){
    const sequenceDocument = await questions_collection.findOneAndUpdate(
        {_id: sequenceName},
        {$inc:{seqValue:1}},
        {returnOriginal: false}
    );
    console.log(sequenceDocument);
    // const doc = JSON.parse(JSON.stringify(sequenceDocument));
    // console.log(typeof(doc.value.seqValue));
    return sequenceDocument.value.seqValue;
}

module.exports = {
    populateQuestion: async function (question_id, question_no, title, user_id, date, question, keywords, num_of_answers) {
        const questions_collection = client.db('question').collection('Questions');
        try {
            const question_doc = {
                _id: question_id,
                question_no: question_no,
                user_id: user_id,
                date: date,
                title: title,
                question: question,
                keywords: keywords,
                num_of_answers: num_of_answers
            }
            const result = await  questions_collection.insertOne(question_doc);
            if (result.insertedCount !== 1)  {
                throw new CustomException("Question not added", 404)
            }
            const res = {
                result: result,
                question_no: question_no,
                date: date
            }
            return res;
        } catch (error) {
            throw error;
        }
    },
    insertQuestion: async function (user_id,  username, title, question, keywords) {
        const questions_collection = client.db('minor_q&a_info').collection('Questions');
        const datetime = new Date();
        try {
            const seq = await getNextSequenceValue(questions_collection, "questionsInfo");
            console.log(seq);
            const question_doc = {
                user_id: user_id,
                username: username,
                title: title,
                question_no: seq,
                question: question,
                date: datetime,
                keywords: keywords,
                num_of_answers: 0
            }
            const result = await  questions_collection.insertOne(question_doc);
            if (result.insertedCount !== 1)  {
                throw new CustomException("Question not added", 404)
            }
            const res = {
                result: result,
                question_no: seq,
                date: datetime
            }
            return res;
        } catch (error) {
            throw error;
        }

    },
    showQuestions: async function () {
        const query = {_id: { $ne: "questionsInfo"} };
        try {
            const questions_collection = client.db('minor_q&a_info').collection('Questions');
            const result = await questions_collection.find(query).toArray();
            //console.log(result);
            //console.log(questions);
            return result;
        }
        catch (error) {
            throw error;
        }



    },
    deleteQuestion: async function (question_id) {
        const query = {_id: question_id};
        try {
            const questions_collection = client.db('minor_q&a_info').collection('Questions');
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
    updateQuestion: async function (question_id, new_title, new_question, new_keywords) {
        const datetime = new Date();
        try {
            const questions_collection = client.db('minor_q&a_info').collection('Questions');
            const query = {_id: question_id};
            const newValues = {
                $set: {
                    date: datetime,
                    question: new_question,
                    title: new_title,
                    keywords: new_keywords
                }
            };
            const result = await  questions_collection.updateOne(query, newValues);
            if (result.modifiedCount === 0) {
                throw new CustomException("Question Not Found", 404);
            }
            return result;
        } catch (error) {
            throw error;
        }


    }

};