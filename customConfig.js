let options = {

    development: {
        client: 'mysql',
        connection: {
        host : '127.0.0.1',
        user : 'root',
        password : "",
        database : 'rfid_attendance'
        },
        migrations: 
        {
            directory: __dirname + '/db/migrations',
        },
        seeds: 
        {
            directory: __dirname + '/db/seeds',
        },
      },


      production: {
        client: 'mysql',
        connection: {
        host : '18.191.74.223',
        user : 'tanviraws',
        password : '01685145574',
        database : 'rfid_attendance'
        },
        migrations: 
        {
            directory: __dirname + '/db/migrations',
        },
        seeds: 
        {
            directory: __dirname + '/db/seeds',
        },
      },

    
  };

const environment = process.env.NODE_ENV || 'development';
const config = options[environment];
module.exports = require('knex')(config);