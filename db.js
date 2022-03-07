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
    user: "pfofxpkgtvyndd",
    password: "8ab7b1173ba5a54a5e200bbc9a6bb876ae1e0d49e20945993c68fb839225c2e5",
    host: "ec2-54-172-169-87.compute-1.amazonaws.com",
    database: "d4us514oa8j7um",
    port: 5432,
});

module.exports = pool;