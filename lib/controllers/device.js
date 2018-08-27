'use strict';

const Pug = require('pug');
const Path = require('path');

module.exports = {

  home: async (request, h) => { 
    const db = request.mongo.db

    try {

        const docs = await db.collection('Device_Status').find({}).toArray()
        //return docs
        var page = h.view('device', {
          // data: {
          //   devices: docs
          // },
          //page: 'List Devices',
          //description: 'List all devices'
        });
    
        return page
    }
    catch (err) {
        throw Boom.internal('Internal MongoDB error', err);
    }
  }, 

  home2: (request, h) => { 
    var page = h.view('device', {
      // data: {
      //   notes: result
      // },
      page: 'List Devices',
      description: 'List all devices'
    });

    return page

  },

};