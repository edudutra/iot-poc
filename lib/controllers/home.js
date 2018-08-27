'use strict';

const Pug = require('pug');
const Path = require('path');
const Boom = require('boom')

module.exports = {

  hello: (request, h) => { 
    return h.view('index', {
        title: 'Running',
        message: 'Hello Pug!'
    });
  }, 

  helloName: (request, h) => { 
    var item = {
      id: 1, name: encodeURIComponent(request.params.name)
    }
    return item
  },

  devices: async (request, h) => {
    const db = request.mongo.db

    try {

        const doc = await db.collection('Device_Status').findOne({ objectId: request.params.id });
        // return doc

        const dev = Pug.renderFile(
          Path.join(__dirname, '../views/components/device.pug'),
          {
            device: doc
          }
        );

        return dev
    }
    catch (err) {
        throw Boom.internal('Internal MongoDB error', err);
    }
  }
  
};