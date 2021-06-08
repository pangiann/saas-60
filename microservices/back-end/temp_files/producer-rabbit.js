const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        const exchange = 'events';
        const msg = 'Hello World!';
        const topic = 'POST_USER';

        channel.assertExchange(exchange, 'direct', {
            durable: false
        });
        channel.publish(exchange, topic, Buffer.from(msg));
        console.log(" [x] Sent %s: '%s'", topic, msg);
    });

    setTimeout(function() {
        connection.close();
        process.exit(0)
    }, 500);
});