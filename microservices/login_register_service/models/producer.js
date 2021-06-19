
const { Kafka } = require('kafkajs')

let kafka;
const myArgs = process.argv.slice(2);
//console.log(myArgs)
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