var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://54.233.228.117', {port:1883, username:'inhaus', password:'inhaus'})

var numberOfClients = 160
var interval = 500

var clients = Array.from({length: numberOfClients}, (v, i) => `client${(i+1).toString().padStart(3, '0')}`)
var cicle = 0
client.on('connect', function () {
  publish()
})

function publish() {
  cicle++
  clients.forEach(item => {
    var message =  `${cicle}/${Date.now().toString()}`
    var topic = `devices/${item}`
    client.publish(topic, message, function(err) {
      if (err) {
        console.log(err)
      } 
      else {
        //console.log(`Topic: ${topic}\tMessage: ${message}`)
      }
    })
  });
  setTimeout(publish, interval)
}