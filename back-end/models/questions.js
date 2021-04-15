const MongoClient = require('mongodb').MongoClient;
const crypto = require('crypto');
const createError = require('http-errors');
// Replace the uri string with your MongoDB deployment's connection string.

const url = "mongodb://localhost:27017";
const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});


module.exports = {
    insertQuestion: async function (username,  question, keywords) {
        await client.connect();
        const users_collection = client.db('q&a').collection('Users');
        const questions_collection = client.db('q&a').collection('Questions');
        const query = {username: username};
        const projection = { projection: {_id:1}};
        const datetime = new Date();
        try {
            const user_id = await users_collection.findOne(query, projection);
            if (user_id === null) {
                throw new Error("User Not Found");
            }
            const question_doc = {
                user_id: user_id._id,
                date: datetime,
                question: question,
                keywords: keywords
            }
            const result = await  questions_collection.insertOne(question_doc);
            console.log(result);
            return result;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        } finally {
            await client.close();
        }

    }
};