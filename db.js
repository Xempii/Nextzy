const pg = require("pg");
require("dotenv").config();

const pool = new pg.Pool({
   user: process.env.DB_USER,
   host: process.env.DB_HOST,
   database: process.env.DB_NAME,
   password: process.env.DB_PASSWORD,
});

// pool
//    .connect()
//    .then(() => {
//       console.log("Connection to database success");
//    })
//    .catch((err) => {
//       console.log(`Error: ${err}`);
//    });

module.exports = pool;
