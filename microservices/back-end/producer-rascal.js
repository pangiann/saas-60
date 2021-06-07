const Broker = require('rascal').BrokerAsPromised;
const config = require('./config');

(async () => {
    try {
        const broker = await Broker.create(config);
        broker.on('error', console.error);
        const obj = {
            question_id: 5,
            username: "pan"
        }
        // Publish a message
        const message_doc = {
            key: "POST_USER",
            value: JSON.stringify(obj)
        }
        const publication = await broker.publish('publish_user', message_doc);
        publication.on('success', (messageId) => {
            console.log("message Id was: ", messageId)
        }).on("error", (err, messageId) => {
            console.error("Error was: ", err.message)
        }).on("return", (message) => {
            console.warn("Message was returned: ", message.properties.messageId)
        })
    } catch(err) {
        console.error(err);
    }
})();