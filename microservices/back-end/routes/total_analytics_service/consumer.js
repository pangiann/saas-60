const questions = require('../../models/total_analytics_service/questions');
const answers = require('../../models/total_analytics_service/answers');
const MAX_RETRIES = 3;
const {ObjectID} = require("bson");

const { Kafka } = require('kafkajs');

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
    await consumer.subscribe({topic: topic});
    await consumer.subscribe({topic: topic2});
    let post_ans_retries = 0;
    await consumer.run({
       /* eachBatchAutoResolve: false,
        eachBatch: async ({ batch, resolveOffset, heartbeat, isRunning, isStale }) => {
            for (let message of batch.messages) {
                const value = message.value.toString()
                const value_json = JSON.parse(value);
                console.log(value_json);
                if (!isRunning() || isStale()) break
                try {
                    if (message.key.toString() === "POST_QUESTION") {
                        await questions.insertQuestion(value_json.username, value_json.keywords, value_json.date);
                    }
                    if (message.key.toString() === "POST_ANSWER") {
                        await answers.insertAnswer(value_json.username, 0, value_json.date)
                    }
                    if (message.key.toString() === "NEW_UPVOTE") {
                        await answers.updateNoUpvotes(value_json.answer_id);
                    }
                    resolveOffset(message.offset)
                    await heartbeat()
                }
                catch (error) {
                    post_ans_retries++;

                    if (post_ans_retries > MAX_RETRIES) {
                        post_ans_retries = 0;
                        resolveOffset(message.offset)
                        await heartbeat()
                    }
                    else {
                        await sleep(5000);
                        await heartbeat()

                    }
                }
            }
        }*/
        eachMessage: ({message}) => {
            const value = message.value.toString()
            const value_json = JSON.parse(value);
            console.log(message.offset);
            console.log(value_json);

            if (message.key.toString() === "POST_QUESTION") {
                questions.insertQuestion(value_json.username, value_json.keywords, value_json.date);
            }
            if (message.key.toString() === "POST_ANSWER") {
                answers.insertAnswer(value_json.username,  0, value_json.date)
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

