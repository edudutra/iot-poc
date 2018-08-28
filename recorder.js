var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://54.233.228.117', {port:1883, username:'inhaus', password:'inhaus'})

const MongoClient = require('mongodb').MongoClient;
// Connection URL
const url = 'mongodb://inhaus:inhaus@54.233.228.117:27017/admin';
// Database Name
const dbName = 'iot-poc';

const conn = MongoClient.connect(url)


const request = require('request');

request('http://localhost:3000/api/instance/5b846b43ca324e22801aca2b', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  console.log(body.url);
  console.log(body.explanation);
});

const subscriptions = ['Advantech/00D0C9FD579C/+']

client.on('connect', function () {
    subscriptions.forEach(subscription => {
        client.subscribe(subscription, function (err) {
            if (err) {
                console.log(`Erro ao subscrever ${subscription}: ${err}`)
            }
        })       
    });
  })
  
client.on('message', function (topic, message) {
    // Insert a single document
    console.log(`${topic}\t${message}`)
    conn.then(function(db) {
        item = parseMessage(topic, message)

        if (item[0] === 'data') {
            db.db(dbName)
                .collection('data')
                .insertOne(item[1], function(err, r) {
                    if (err) {
                        console.log(`Erro ao salvar: ${item}\t${err}`)
                    }
            })

            db.db(dbName)
            .collection('Device_Status')
            .findOne(
                { objectId: item[1].objectId},
                function(err, doc) {
                if (err) {
                    console.log(`Erro ao salvar: ${item}\t${err}`)
                }
                
                if (item[1].data && 'do1' in item[1].data) {
                    doc.last_do = item[1].data
                }
                else if (item[1].data && 'di1' in item[1].data) {
                    doc.last_di = item[1].data
                }

                db.db(dbName)
                .collection('Device_Status')
                .updateOne(
                    { objectId: item[1].objectId},
                    { $set: doc },
                    { upsert: true},
                    function(err, r) {
                    if (err) {
                        console.log(`Erro ao salvar: ${item}\t${err}`)
                    }
                })

            })

        }
        else if (item[0] === 'Device_Status') {
            db.db(dbName)
                .collection('Device_Status')
                .updateOne(
                    { objectId: item[1].objectId},
                    { $set: item[1]},
                    { upsert: true},
                    function(err, r) {
                    if (err) {
                        console.log(`Erro ao salvar: ${item}\t${err}`)
                    }
            })
        }

    })
    .catch(function(e) {
        console.log(e);
      });
})

function parseMessage(topic, message) {
    topic_path = topic.split('/')
    if (topic_path.length != 3) {
        return null
    }
    item = {
        objectId : topic_path[1], 
        objectBrand : topic_path[0]
    }
    switch (topic_path[2]) {
        case 'data':
            item.data = JSON.parse(message)
            break;
        case 'Device_Status':
            item.status = JSON.parse(message)
        default:
            break;
    }
    return [topic_path[2], item]
}

module.exports = parseMessage