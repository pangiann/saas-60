
const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'askMeAnything',
    brokers: ['localhost:9093', "localhost:9094", "localhost:9095"]
})
const producer = kafka.producer();

module.exports = {
    produce_register_event: async function (user_id, username, email) {
        await producer.connect();
        const topic = "users";
        const obj = {
            user_id: user_id,
            username: username,
            email: email
        }
        try {
            await producer.send({
                topic,
                messages: [
                    {
                        key: "POST_USER",
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