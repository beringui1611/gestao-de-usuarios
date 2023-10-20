const knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: "127.0.0.1",
        user: "root",
        password: "Caique17242630",
        database:'usertest'
    }

})

module.exports = knex