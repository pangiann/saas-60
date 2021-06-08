const questions = require('./models/add_q&a_service/questions');
const answers = require('./models/add_q&a_service/answers');

const produce_qa = require('./models/add_q&a_service/producer');
const produce = require('./models/login_register_service/producer');
const users = require('./models/login_register_service/users');
const faker = require('faker');
const {getQuestion} =  require('random-questions');
const {ObjectID} = require("bson");


const populateUsers = async (usernames, emails, passwords, user_ids, number_of_users) => {
    for (let i = 0; i < number_of_users; i++) {
        const randomName = faker.name.findName();
        usernames.push(randomName);
        const randomEmail = faker.internet.email();
        emails.push(randomEmail)
        const password = "1234";
        passwords.push(password);
        await users.insertUser(randomName, password, randomEmail)
            .then(result => {
                user_ids.push(result.insertedId)
                produce.produce_register_event(result.insertedId, randomName, randomEmail)
                    .then(r => {
                        console.log("result successfull")
                    })
                    .catch(err => {
                        throw err;
                    })
            })
            .catch(err => {
                console.log("fuck abort now");

            })


    }

}
const populateQuestions = async (user_ids, usernames, question_ids) => {
    for (let i = 0; i < user_ids.length; i++) {
        const title = getQuestion();
        const splitted = title.split(" ");
        const asc = splitted.sort((a,b) => b.length - a.length);
        const keywords = [asc[0], asc[1], faker.random.word()]
        const question = faker.lorem.sentences();
        await questions.insertQuestion(ObjectID(user_ids[i]), usernames[i], title, question, keywords)
            .then(result => {
                question_ids.push(result.result.insertedId)
                produce_qa.produce_addQuestion_event(user_ids[i], usernames[i], result.result.insertedId, result.question_no, title, question, keywords, result.date, 0)
                    .then(r => {
                        console.log("result successfull")
                    })
                    .catch(err => {
                        throw err;
                    })
            })
            .catch(err => {
                console.log("fuck abort now");

            })
    }

}

const populateAnswer = async (user_ids, usernames, question_ids, answer_ids) => {
    for (let i = 0; i < question_ids.length; i++) {
        const answer = faker.lorem.sentences();
        const user_no = (question_ids.length - i) % user_ids.length;
        await answers.insertAnswer(ObjectID(user_ids[user_no]), usernames[user_no], question_ids[i], answer)
            .then(result => {
                answer_ids.push(result.result.insertedId)
                produce_qa.produce_addAnswer_event(result.result.insertedId, user_ids[user_no], usernames[user_no], question_ids[i], result.question_no, answer, result.date)
                    .then(r => {
                        console.log("result successfull")
                    })
                    .catch(err => {
                        throw err;
                    })
            })
            .catch(err => {
                console.log("fuck abort now");

            })

    }

}
const populate = async () => {
    let usernames = [];
    let emails = [];
    let passwords = [];
    let user_ids = [];
    await populateUsers(usernames, emails, passwords, user_ids, 1);
    console.log(user_ids)
    let question_ids = [];
    await populateQuestions(user_ids, usernames, question_ids);
    console.log(question_ids);
    let answer_ids = [];
    await populateAnswer(user_ids, usernames, question_ids, answer_ids);
    console.log(answer_ids)

   // console.log(faker.random.word())

}

populate()