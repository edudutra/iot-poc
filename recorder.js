var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://10.0.110.53', {port:1883})

const MongoClient = require('mongodb').MongoClient;
// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'iot-poc';

const conn = MongoClient.connect(url)

client.on('connect', function () {
    client.subscribe('devices/#', function (err) {
      if (err) {
        console.log(err)
        exit(1)
      }
    })
  })
  
client.on('message', function (topic, message) {
    // Insert a single document
    conn.then(function(db) {
        db.db(dbName).collection('messages').insertOne(
            {
                topic:topic,
                message:message.toString()
            }, function(err, r) {
            //console.log(message.toString())
        });
    })
    .catch(function(e) {
        console.log(e);
      });
})