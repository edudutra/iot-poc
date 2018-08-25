var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://54.233.228.117', {port:1883, username:'inhaus', password:'inhaus'})
var moment = require('moment')

var interval = 500
var active = true

var clients = [
  {
    topic: 'Advantech/00D0C9FD579C/data', 
    do: {
      "s":9,
      "t":"2018-08-25T03:51:42Z",
      "q":192,
      "c":0,
      "do1":false,
      "do2":false,
      "do3":false,
      "do4":false
    },
    di: {
      "s":9,
      "t":"2018-08-25T03:51:42Z",
      "q":192,
      "c":0,
      "di1":false,
      "di2":false,
      "di3":false,
      "di4":false
    }
  },
]

var cicle = 0
client.on('connect', function () {
  publish()
})

function publish() {
  if (active) {
    cicle++
    clients.forEach(item => {

      t = moment().format()
      item.do.t = t
      item.di.t = t
      
      message = JSON.stringify(item.do)
      client.publish(item.topic, message, function(err) {
        if (err) {
          console.log(err)
        } 
        else {
          console.log(`Topic: ${item.topic}\tMessage: ${message}`)
        }
      })

      message = JSON.stringify(item.di)
      client.publish(item.topic, message, function(err) {
        if (err) {
          console.log(err)
        } 
        else {
          console.log(`Topic: ${item.topic}\tMessage: ${message}`)
        }
      })

    });
  }
  setTimeout(publish, interval)
}

client.subscribe('sender/#', function(err) {})

client.on('message', function (topic, message) {
  // Insert a single document
  if (topic == 'sender/suspend') {
    suspended = true
    
    //process.exit(0)
  }
  switch (topic) {
    case 'sender/suspend':
      active = false
      console.log('suspending...')
      break;
    case 'sender/resume':
    default:
      active = true
      console.log('resuming...')
      break;
  }
})
