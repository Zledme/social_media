const Pool = require('pg').Pool;
require("dotenv").config();
// const devConfig = new Pool({
//     user: process.env.PG_USER,
//     password: process.env.PG_PASSWORD,
//     host: process.env.PG_HOST,
//     database: process.env.PG_DATABASE,
//     port: process.env.PG_PORT,
// })

const proConfig = process.env.DATABASE_URL; 

const pool = new Pool({
    
    connectionString: proConfig,
});

module.exports = pool;