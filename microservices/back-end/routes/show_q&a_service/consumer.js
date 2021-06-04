//const users_model = require('models/users_profile_service/users')

const questions = require('../../models/show_q&a_service/questions');
const answers = require('../../models/show_q&a_service/answers');
const {ObjectID} = require("bson");
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'askMeAnything',
    brokers: ['localhost:9093', "localhost:9094", "localhost:9095"]
})

const consumer = kafka.consumer({groupId: "ShowQ&AProfile"})

const consume = async() => {
    await consumer.connect();
    const topic = "questions";
    const topic2 = "answers";
    await consumer.subscribe({topic: topic});
    await consumer.subscribe({topic: topic2});
    await consumer.run({
        eachMessage: ({message}) => {
            const value = message.value.toString()
            const value_json = JSON.parse(value);
            if (message.key.toString() === "POST_QUESTION") {
                 questions.insertQuestion(ObjectID(value_json.user_id), value_json.username, ObjectID(value_json.question_id), value_json.title, value_json.question,
                                          value_json.question_no, value_json.date, value_json.keywords, value_json.num_of_answers);
            }
            if (message.key.toString() === "POST_ANSWER") {
                answers.insertAnswer(ObjectID(value_json.answer_id), ObjectID(value_json.question_id), ObjectID(value_json.user_id),
                                     value_json.username, value_json.question_no, value_json.answer, value_json.date)
            }
            if (message.key.toString() === "NEW_UPVOTE") {
                answers.updateNoUpvotes(value_json.answer_id);
            }
        }

    })
}

consume().catch((err) => {
    console.error("error in consumer: ", err)
})