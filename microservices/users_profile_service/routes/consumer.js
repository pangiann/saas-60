//const users_model = require('models/users_profile_service/users')

const users = require('../models/users');
const MAX_RETRIES = 10;
const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'askMeAnything',
    brokers: ['localhost:9093', "localhost:9094", "localhost:9095"]
})

const consumer = kafka.consumer({groupId: "UsersProfile"})
function CustomException(message, code) {
    const error = new Error(message);

    error.code = code;
    return error;
}

CustomException.prototype = Object.create(Error.prototype);
const consume = async() => {
    await consumer.connect();
    const topic = "users";
    const topic2 = "questions";
    const topic3 = "answers";
    let user_retries = 0;
    let messages_topics_offsets = {};
    let messages_topics_partition = {};
    let last_topic;
    let last_offset;
    let last_partition;
    await consumer.subscribe({topic: topic})
    await consumer.subscribe({topic: topic2})
    await consumer.subscribe({topic: topic3})
    await consumer.run({
        autoCommit: true,
        eachMessage: async ({topic, partition, message}) => {
            const key = message.key.toString();
            const value = message.value.toString();
            //console.log(message.offset)
            const value_json = JSON.parse(value);
            console.log(value_json)
            messages_topics_offsets[topic] = message.offset;
            last_topic = topic;
            last_offset = parseInt(message.offset) + 1;
            last_partition = partition;
            messages_topics_partition[topic] = partition;
            try {

                if (key === "POST_USER") {
                    console.log(value_json.user_id)
                    await users.insertUser(value_json.user_id, value_json.username, value_json.email);
                }

                if (key === "POST_QUESTION") {
                    await users.updateNoQuestions(value_json.user_id);
                }

                if (key === "POST_ANSWER") {
                    await users.updateNoAnswers(value_json.user_id);

                }
                if (key === "NEW_UPVOTE") {
                    await users.updateNoUpvotes(value_json.user_id_given, value_json.user_id_received);
                }


                await consumer.seek(({topic: last_topic, partition: last_partition, offset: last_offset.toString()}))

            }
            catch(error) {
                console.log(error);
                setTimeout(function(){
                    user_retries++;
                    //console.log(user_retries);
                    if (user_retries <= MAX_RETRIES) {
                        consumer.seek({topic: topic, partition: partition, offset: message.offset})
                    }
                    else {
                        console.log("hello")
                        user_retries = 0;
                        consumer.seek(({topic: last_topic, partition: last_partition, offset: last_offset.toString()}))

                    }
                }, 3000);

            }
        }

    })

}

consume().catch((err) => {
    console.error("error in consumer: ", err)
})
