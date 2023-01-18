const mongoose = require("mongoose");
const chalk = require("chalk");

const connectionURL = `${process.env.MONGOOSE_CONN_URL}${process.env.DB_NAME}`;

mongoose.set("strictQuery", false);
mongoose.connect(connectionURL, { autoIndex: true });

console.log(chalk.yellow("Connected successfully to the mongoDB server"));
