'use strict';

const Home = require('./controllers/home');
const Device = require('./controllers/device');
const Instance = require('./controllers/instance');

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
    {
        method: 'GET',
        path: '/api/device/{id}',
        handler: Device.readOne,
        config: {
          description: 'List the devices'
        }
    },
    {
        method: 'GET',
        path: '/api/device',
        handler: Device.read,
        config: {
          description: 'List the devices'
        }
    },

    {
        method: 'GET',
        path: '/instance',
        handler: Instance.home,
        config: {
          description: 'List the instances'
        }
    },
    {
        method: 'GET',
        path: '/api/instance/{id}',
        handler: Instance.readOne,
        config: {
          description: 'List the Instances'
        }
    },
    {
        method: 'GET',
        path: '/api/instance',
        handler: Instance.read,
        config: {
          description: 'List an instance by id'
        }
    },
];  