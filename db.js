const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'sammy',
    password: 'HeySammy',
    host: "localhost",
    database: "socialmedia",
    port: 5432
})

module.exports = pool;