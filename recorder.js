var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://54.233.228.117', {port:1883, username:'inhaus', password:'inhaus'})

const MongoClient = require('mongodb').MongoClient;
// Connection URL
const url = 'mongodb://inhaus:inhaus@54.233.228.117:27017/admin';
// Database Name
const dbName = 'iot-poc';

const conn = MongoClient.connect(url)

client.on('connect', function () {
    client.subscribe('#', function (err) {
      if (err) {
        console.log(err)
        proccess.exit(1)
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