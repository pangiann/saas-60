const questions = require('../../models/total_analytics_service/questions');
const answers = require('../../models/total_analytics_service/answers');
const {ObjectID} = require("bson");

const { Kafka } = require('kafkajs');
const MAX_RETRIES = 10;

const kafka = new Kafka({
    clientId: 'askMeAnything',
    autoCommit: false,
    brokers: ['localhost:9093', "localhost:9094", "localhost:9095"]
})

const consumer = kafka.consumer({groupId: "total_analytics"})
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
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
                    await questions.insertQuestion(ObjectID(value_json.question_id), value_json.username, value_json.keywords, value_json.date);
                }
                if (message.key.toString() === "POST_ANSWER") {
                    await answers.insertAnswer(ObjectID(value_json.answer_id), value_json.username,  0, value_json.date)
                }
                if (message.key.toString() === "NEW_UPVOTE") {
                    await answers.updateNoUpvotes(ObjectID(value_json.answer_id));
                }
            }
            catch (error) {
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

