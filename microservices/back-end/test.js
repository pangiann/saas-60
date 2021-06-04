
const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'askMeAnything',
    brokers: ['localhost:9093', "localhost:9094", "localhost:9095"]
})
const producer = kafka.producer();


async function produceAddAnswer(answer_id, user_id, username, question_id, question_no, answer, date) {
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
}
const curr = new Date();
produceAddAnswer("hello fucking world", "fuck", "pan", "kappa", "kappakipos", "hello", curr)
     .then(res => {
         console.log(res)
     })
     .catch(err => {
         throw new err;
     })