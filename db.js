const { Pool } = require("pg");
const PASSWORD = process.env.PASSWORD;
const USERNAME = process.env.USERNAME;
const DATABASE_NAME = "users";
const CONNECTION_STRING = `postgresql://postgres:${PASSWORD}@localhost:5432/${DATABASE_NAME}`;
console.log(CONNECTION_STRING)
const config = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    }
  : { connectionString: CONNECTION_STRING };

const pool = new Pool(config);

module.exports = pool;
