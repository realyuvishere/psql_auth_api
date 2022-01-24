const {
    Pool,
    Client,
} = require('pg')

const en = process.env

const credentials = {
    user: en.PSQL_USER,
    host: en.PSQL_HOST,
    database: en.PSQL_DB,
    password: en.PSQL_PASS,
    port: en.PSQL_PORT,
}

const pool = new Pool(credentials)

pool.on('connect', () => {
    console.log('Connected to database')
})

const client = new Client(credentials)

module.exports = {
    pool,
    client,
}

