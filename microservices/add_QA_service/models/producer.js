
const { Kafka } = require('kafkajs')
const KafkaNode = require('node-rdkafka');
let kafka;
const myArgs = process.argv.slice(2);
console.log(myArgs)
if (myArgs[0] !== 'localhost') {
    kafka = new Kafka({
        clientId: 'askMeAnything',
        brokers: ['pkc-epwny.eastus.azure.confluent.cloud:9092'],
        ssl: true,
        sasl: {
            username : process.env.KAFKA_KEY,
            password : process.env.KAFKA_SECRET,
            mechanism : 'PLAIN'
        }
    })
}
else {
    kafka = new Kafka({
        clientId: 'askMeAnything',
        brokers: ['localhost:9093', "localhost:9094", "localhost:9095"]
    })
    console.log("okay");
}


const producer = kafka.producer();

module.exports = {
    produce_addQuestion_event: async function (user_id,  username, question_id, question_no, title, question, keywords, date, num_of_answers) {
        await producer.connect();
        const topic = "questions";
        const obj = {
            question_id: question_id,
            username: username,
            user_id: user_id,
            question_no: question_no,
            title: title,
            question: question,
            keywords: keywords,
            date: date,
            num_of_answers: num_of_answers
        }
        try {
            await producer.send({
                topic,
                messages: [
                    {
                        key: "POST_QUESTION",
                        value: JSON.stringify(obj)
                    }
                ]
            });
            console.log("write succesfull");
        }
        catch (err) {
            console.error("could not write message " + err);
        }
    },
    produce_addAnswer_event: async function (answer_id, user_id, username, question_id, question_no, answer, date) {
        await producer.connect();
        const topic = "answers";
        const obj = {
            answer_id: answer_id,
            username: username,
            question_id: question_id,
            user_id: user_id,
            question_no: question_no,
            answer: answer,
            date: date
        }
        try {
            await producer.send({
                topic,
                messages: [
                    {
                        key: "POST_ANSWER",
                        value: JSON.stringify(obj)
                    }
                ]
            });
            console.log("write succesfull");

        }
        catch (err) {
            console.error("could not write message " + err);
        }
    },
    produce_newUpvote_event: async function (answer_id, user_id_given, user_id_received) {
        await producer.connect();
        const topic = "answers";
        const obj = {
            answer_id: answer_id,
            user_id_given: user_id_given,
            user_id_received: user_id_received
        }
        try {
            await producer.send({
                topic,
                messages: [
                    {
                        key: "NEW_UPVOTE",
                        value: JSON.stringify(obj)
                    }
                ]
            });
            console.log("write succesfull");
        }
        catch (err) {
            console.error("could not write message " + err);
        }
    }

};