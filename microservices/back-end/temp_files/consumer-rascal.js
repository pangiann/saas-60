const Broker = require('rascal').BrokerAsPromised;
const config = require('./config.json');
function CustomException(message, code) {
    const error = new Error(message);

    error.code = code;
    return error;
}

CustomException.prototype = Object.create(Error.prototype);
(async () => {
    try {
        const broker = await Broker.create(config);
        broker.on('error', console.error);
        let num = 0;
        // Consume a message
        const subscription = await broker.subscribe('users_subscription');
        subscription.on('message', (message, content, ackOrNack) => {
            console.log(content);
            console.log(message);
            const value_json = JSON.parse(content.value);
            console.log(value_json);

            /*try {
                throw new CustomException("lahtos", 404)
            }
            catch(error) {
                num += 1
                console.log(num)
                if (num < 10)
                    ackOrNack(error, { strategy: 'nack', defer: 1000, requeue: true, attempts: 10})
                else ackOrNack()
            }*/
            ackOrNack();

        }).on('error', err => {
            console.error('Subscriber error', err);
        }).on('invalid_content', (err, message, ackOrNack) => {
            console.error('Invalid content', err)
            ackOrNack(err, { strategy: 'nack', defer: 1000, requeue: true, attempts: 10})
        }).on('redeliveries_exceeded', (err, message, ackOrNack) => {
            console.error('Redeliveries exceeded', err)
            ackOrNack(err)
        })
    } catch(err) {
        console.error(err);
    }
})();