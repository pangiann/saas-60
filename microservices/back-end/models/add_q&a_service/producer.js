
const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'askMeAnything',
    brokers: ['localhost:9093', "localhost:9094", "localhost:9095"]
})
const producer = kafka.producer();

module.exports = {
    produce_addQuestion_event: async function (user_id,  question_id, question_no, title, question, keywords, date) {
        await producer.connect();
        const topic = "questions";
        const obj = {
            question_id: question_id,
            user_id: user_id,
            question_no: question_no,
            title: title,
            question: question,
            keywords: keywords,
            date: date
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
    produce_addAnswer_event: async function (answer_id, user_id, question_id, question_no, answer, date) {
        await producer.connect();
        const topic = "answers";
        const obj = {
            answer_id: answer_id,
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