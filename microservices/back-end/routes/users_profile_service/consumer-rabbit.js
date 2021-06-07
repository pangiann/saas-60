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

        channel.assertExchange(exchange, 'direct', {
            durable: false
        });
        const queue = 'users';
        channel.assertQueue(queue, {
            exclusive: true
        }, function(error2, q) {
            if (error2) {
                throw error2;
            }
            console.log(' [*] Waiting for logs. To exit press CTRL+C');
            const topics = ['POST_USER']

            channel.bindQueue(q.queue, exchange, topics[0]);


            channel.consume(q.queue, function(msg) {
                console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
                channel.ack(msg);
            }, {
                noAck: false
            });
        });
    });
});