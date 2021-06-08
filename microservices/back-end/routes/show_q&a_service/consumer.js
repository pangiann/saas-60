//const users_model = require('models/users_profile_service/users')

const questions = require('../../models/show_q&a_service/questions');
const answers = require('../../models/show_q&a_service/answers');
const {ObjectID} = require("bson");
const { Kafka } = require('kafkajs');
const MAX_RETRIES = 10;

const kafka = new Kafka({
    clientId: 'askMeAnything',
    brokers: ['localhost:9093', "localhost:9094", "localhost:9095"]
})

const consumer = kafka.consumer({groupId: "ShowQ&AProfile"})

const consume = async() => {
    await consumer.connect();
    const topic = "questions";
    const topic2 = "answers";
    let user_retries = 0;
    let messages_topics_offsets = {};
    let messages_topics_partition = {};
    let last_topic;
    let last_offset;
    let last_partition;
    await consumer.subscribe({topic: topic});
    await consumer.subscribe({topic: topic2});
    await consumer.run({
        eachMessage: async ({topic, partition, message}) => {
            const key = message.key.toString();
            const value = message.value.toString();
            //console.log(message.offset)
            const value_json = JSON.parse(value);
            //console.log(value_json)
            messages_topics_offsets[topic] = message.offset;
            last_topic = topic;
            last_offset = parseInt(message.offset) + 1;
            last_partition = partition;
            messages_topics_partition[topic] = partition;
            try {
                if (message.key.toString() === "POST_QUESTION") {
                    await questions.insertQuestion(ObjectID(value_json.user_id), value_json.username, ObjectID(value_json.question_id), value_json.title, value_json.question,
                        value_json.question_no, value_json.date, value_json.keywords, value_json.num_of_answers);
                }
                if (message.key.toString() === "POST_ANSWER") {
                    await answers.insertAnswer(ObjectID(value_json.answer_id), ObjectID(value_json.question_id), ObjectID(value_json.user_id),
                        value_json.username, value_json.question_no, value_json.answer, value_json.date)
                }
                if (message.key.toString() === "NEW_UPVOTE") {
                    await answers.updateNoUpvotes(ObjectID(value_json.answer_id));
                }
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