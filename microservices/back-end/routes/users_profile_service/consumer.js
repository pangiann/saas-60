//const users_model = require('models/users_profile_service/users')

const users = require('../../models/users_profile_service/users');

const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'askMeAnything',
    brokers: ['localhost:9093', "localhost:9094", "localhost:9095"]
})

const consumer = kafka.consumer({groupId: "UsersProfile"})

const consume = async() => {
    await consumer.connect();
    const topic = "users";
    const topic2 = "questions";
    const topic3 = "answers";
    await consumer.subscribe({topic})
    await consumer.subscribe({topic: topic2})
    await consumer.subscribe({topic: topic3})
    await consumer.run({
        eachMessage: ({message}) => {
            const key = message.key.toString();
            const value = message.value.toString();
           // console.log(value)
            const value_json = JSON.parse(value);
           // console.log(value_json)
            if (key === "POST_USER") {
                users.insertUser(value_json.user_id, value_json.username, value_json.email);
            }

            if (key === "POST_QUESTION") {
                users.updateNoQuestions(value_json.user_id);
            }

            if (key === "POST_ANSWER") {
                users.updateNoAnswers(value_json.user_id);

            }
            if (key === "NEW_UPVOTE") {
                users.updateNoUpvotes(value_json.user_id_given, value_json.user_id_received);
            }
        }

    })
}

consume().catch((err) => {
    console.error("error in consumer: ", err)
})