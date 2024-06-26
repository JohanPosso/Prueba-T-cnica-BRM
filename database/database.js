const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const database = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
  port: 5432,
  dialect: "postgres",
  logging: false,
  dialectOptions:
    process.env.NODE_ENV === "production"
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      : {}
});
database.sync({ alter: true });

module.exports = { database };
