'use strict';

const Home = require('./controllers/home');
const Device = require('./controllers/device');

module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: Home.hello,
        config: {
          description: 'Says hello to the world'
        }
    },

    {
        method: 'GET',
        path: '/{id}',
        handler: Home.devices,
        config: {
          description: 'Says hello to someone'
        }
    },

    {
        method: 'GET',
        path: '/device',
        handler: Device.home,
        config: {
          description: 'List the devices'
        }
    },
];  