const MongoClient = require('mongodb').MongoClient;
const crypto = require('crypto');
// Replace the uri string with your MongoDB deployment's connection string.
const myArgs = process.argv.slice(2);
console.log(myArgs)
let url;
if (myArgs[0] !== 'localhost') {
    url = process.env.MONGO_URL;
}
else  url = "mongodb://localhost:27017"

const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
client.connect();

let hasher = (password, salt) => {
    let hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    let value = hash.digest('hex');
    return {
        salt: salt,
        hashedpassword: value
    };
}

let hash = (password, salt) => {
    if (password == null || salt == null) {
        throw new Error('Must Provide Password and salt values');
    }
    if (typeof password !== 'string' || typeof salt !== 'string') {
        throw new Error('password must be a string and salt must either be a salt string or a number of rounds');
    }
    return hasher(password, salt);
};
let compare = (password, hash) => {

    if (password == null || hash == null) {
        throw new Error('password and hash is required to compare');
    }
    if (typeof password !== 'string' || typeof hash !== 'object') {
        throw new Error('password must be a String and hash must be an Object');
    }
    let passwordData = hasher(password, hash.salt);
    console.log(passwordData.hashedpassword);
    return passwordData.hashedpassword === hash.password;

};
module.exports = {
    insertUser: async function (username, password, email) {
        const users_collection = client.db('users_simple_info').collection('Users');
        const salt = crypto.randomBytes(32).toString('hex');
        console.log(username);
        console.log(password);
        const json_pass = hash(password, salt);
        const user_doc = {
            username: username,
            password: json_pass.hashedpassword,
            salt: json_pass.salt,
            email: email
        };
        try {

            const result = await users_collection.insertOne(user_doc);
            console.log(result);
            return result;

        }
        catch (error) {
            throw error;
        }


    },
    checkUserCreds: async function (username, password) {
        const users_collection = client.db('users_simple_info').collection('Users');
        const query = {username: username};
        console.log(username);
        console.log(password);
        const projection = { projection: {password: 1, salt:1, _id:0}};
        try {
            const hash = await users_collection.findOne(query, projection);
            console.log(hash);
            const result = compare(password, hash);
            console.log(result);
            return result;
        } catch (error) {
            console.log(error);
            return false;
        }

    },

    findUser : async function(name) {
        const query = { username: name };
        const projection ={projection: {password: 0, salt: 0}};
        try {
            const result = await client.db('users_simple_info').collection('Users').findOne(query, projection);
            console.log(result);
            return result;
        } catch (error) {
            console.log(error);
            throw error;
        }



    }
};
