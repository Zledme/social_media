const {Pool} = require('pg');
require("dotenv").config();
// const pool = new Pool({
//     user: "sammy",
//     password: "HeySammy",
//     host: "localhost",
//     database: "socialmedia",
//     port: 5432,
// });


const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     ssl: true
});

module.exports = pool;