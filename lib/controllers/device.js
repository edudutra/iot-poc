'use strict';

const Pug = require('pug');
const Path = require('path');
const Boom = require('boom')

module.exports = {

  home: async (request, h) => { 
    const db = request.mongo.db

    try {

        const docs = await db.collection('Device_Status').find({}).toArray()

        var page = h.view('device', {
          data: {
            devices: docs
          },
          //page: 'List Devices',
          //description: 'List all devices'
        });
    
        return page
    }
    catch (err) {
        throw Boom.internal('Internal MongoDB error', err);
    }
  }, 

  read: async (request, h) => { 
    const db = request.mongo.db

    try {

        return await db.collection('Device_Status').find({}).toArray()
    }
    catch (err) {
        throw Boom.internal('Internal MongoDB error', err);
    }
  },

  readOne: async (request, h) => { 
    const db = request.mongo.db

    var item = request.params.id

    try {

        return await db.collection('Device_Status').findOne({objectId: item})
    }
    catch (err) {
        throw Boom.internal('Internal MongoDB error', err);
    }
  },

};