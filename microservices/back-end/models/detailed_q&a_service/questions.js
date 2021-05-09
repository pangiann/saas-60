const MongoClient = require('mongodb').MongoClient;
const crypto = require('crypto');
const createError = require('http-errors');
const BSON = require('bson');

// Replace the uri string with your MongoDB deployment's connection string.

const url = "mongodb://localhost:27017";
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
    insertQuestion: async function (user_id,  title, question, keywords) {
        const users_collection = client.db('q&a').collection('Users');
        const questions_collection = client.db('q&a').collection('Questions');
        const query = {_id:  user_id};
        const projection = { projection: {_id:1} };
        const datetime = new Date();
        try {
            const user_id_info = await users_collection.findOne(query, projection);
            if (user_id_info === null) {
                throw new CustomException("User Not Found", 404);
            }
            const seq = await getNextSequenceValue(questions_collection, "questionsInfo");
            console.log(seq);
            const question_doc = {
                question_no: seq,
                user_id: user_id,
                date: datetime,
                title: title,
                question: question,
                keywords: keywords,
                num_of_answers: 0
            }
            const result = await  questions_collection.insertOne(question_doc);
            return result;
        } catch (error) {
            throw error;
        }

    },
    showQuestions: async function () {
        const query = {_id: { $ne: "questionsInfo"} };
        try {
            const questions_collection = client.db('q&a').collection('Questions');
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
            const questions_collection = client.db('q&a').collection('Questions');
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
            const questions_collection = client.db('q&a').collection('Questions');
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


    },
    findQuestionByKeywords: async function (keyword_array) {
        const query = {keywords: {$in: keyword_array } };
        console.log(keyword_array);
        try {
            const questions_collection = client.db('q&a').collection('Questions');
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
        const users_collection = client.db('q&a').collection('Users');
        const projection = { projection: {_id:1} };
        try {
            const user_id = await users_collection.findOne(query, projection);
            if (user_id === null) {
                throw new CustomException("User Not Found", 404);
            }
            const questions_collection = client.db('q&a').collection('Questions');
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