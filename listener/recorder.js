const Settings = require('./settings');
const mqtt = require('mqtt')
const axios = require("axios");
const rules = require('./rules/parser')

const MongoClient = require('mongodb').MongoClient;
// Connection URL
const url = 'mongodb://inhaus:inhaus@54.233.228.117:27017/iot-poc?authSource=admin';
// Database Name
const dbName = 'iot-poc';

const conn = MongoClient.connect(url)

async function getSubscription() {
    var url = `${Settings[Settings.env].apiurl}/api/instance/${Settings[Settings.env].apikey}`
    console.log(`url: ${url}`)
    try {
        const response = await axios.get(url);
        const data = response.data;
        return [data.topic]
    } catch (error) {
        console.log(error);
    }
}


async function init() {

    const subscription = await getSubscription()
    console.log(`-> ${subscription}`)

    var client  = mqtt.connect(`mqtt://${subscription.host}`, {port: subscription.port, username: subscription.user, password: subscription.password})
    
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

            item = rules.parseMessage(topic, message)

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
}

init()
.catch(function(err) {
    console.log(err)
})
