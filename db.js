const { Pool } = require("pg");
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_USERNAME = process.env.DATABASE_USERNAME;
const DATABASE_NAME = process.env.DATABASE_NAME;
const CONNECTION_STRING = `postgresql://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@localhost:5432/${DATABASE_NAME}`;

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
