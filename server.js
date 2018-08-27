'use strict';

const Hapi = require('hapi');
const Hoek = require('hoek');
const Settings = require('./settings');
const Routes = require('./lib/routes');
const Path = require('path');

const server = Hapi.Server({ port: Settings.port });

const dbOpts = {
    url: Settings[Settings.env].db,
    //db: 'iot-poc',
    settings: {
        poolSize: 10
    },
    decorate: true
}

server.route(Routes)

const init = async () => {

    await server.register(
        [
            { plugin: require('hapi-mongodb'), options: dbOpts},
            require('vision')
        ])
        
    server.views({
        engines: { pug: require('pug') },
        path: Path.join(__dirname, 'lib/views'),
        compileOptions: {
          pretty: ! Settings.env === 'production'
        },
        isCached: Settings.env === 'production',
        layout: true,
        layoutPath: Path.join(__dirname, 'lib/views')
      });

    await server.start()
    
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
