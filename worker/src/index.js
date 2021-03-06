var amqp = require('amqplib');
var { Pool, Client } = require('pg');
var envs = require('envs');
var util = require('util');

var debug = envs('DEBUG');
var config = {
  pg: {
    host: envs('POSTGRES_HOST', 'postgres'),
    user: envs('POSTGRES_USER', 'admin'),
    password: envs('POSTGRES_PASSWORD', 'ykkykk1857'),
    database: envs('POSTGRES_DB', 'vote'),
    port: envs('POSTGRES_DB_PORT', '5432')
  },
  rabbitmq: {
    host: envs('RABBITMQ_HOST', 'rabbitmq'),
    username: envs('RABBITMQ_USERNAME', 'guest'),
    password: envs('RABBITMQ_PASSWORD', 'guest'),
    port: envs('RABBITMQ_AMQP_PORT', '5672'),
    vhost: envs('RABBITMQ_VHOST', '%2f'),
    queue: envs('RABBITMQ_QUEUE', 'vote')
  }
};

if (debug) console.log('---Config---');
if (debug) console.log(JSON.stringify(config, null, 4));

var pool = new Pool(config.pg);

pool.query({
  text: `CREATE TABLE IF NOT EXISTS votes (
    id UUID PRIMARY KEY,
    vote varchar(1) NOT NULL,
    ts bigint NOT NULL
  )`
  }).then(function(res) {
    console.log('votes Table Created')
  }).catch(function(err) {
    console.log('SQL Error:', err );
  });

var voteQueue = config.rabbitmq.queue;
var rabbitUrl = util.format('amqp://%s:%s@%s:%s/%s', config.rabbitmq.username, config.rabbitmq.password, config.rabbitmq.host, config.rabbitmq.port, config.rabbitmq.vhost);
var rConn = amqp.connect(rabbitUrl);
var datetime = new Date();
console.log('Starting Worker new=>'+datetime);
rConn.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {
    return ch.assertQueue(voteQueue, {durable: false})
    .then(function(ok) {
      return ch.consume(voteQueue, function(msg) {
        if (msg !== null) {
          console.log('processing rabbitmq message: %s', msg.content.toString());
          var voteData = JSON.parse(msg.content);
          pool.query({
            text: 'INSERT INTO votes (id, vote, ts) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET vote = excluded.vote, ts = excluded.ts',
            values: [ voteData.voter_id, voteData.vote, voteData.ts ]
          }).then(function(results) {
            console.log('Inserted: %s %s', voteData.voter_id, voteData.vote);
            ch.ack(msg);
          }, function(err){
            console.log('SQL Error:', err );
          });
        }
      });
    });
  }).catch(function (err) { 
    console.error(err);
    process.exit()

   });
