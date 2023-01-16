const mongoose = require("mongoose");
const chalk = require("chalk");

const dbName = "task-manager-app";
const connectionURL = `${process.env.MONGOOSE_CONN_URL}${dbName}`;

mongoose.set("strictQuery", false);
mongoose.connect(connectionURL, { autoIndex: true });

console.log(chalk.yellow("Connected successfully to the mongoDB server"));
