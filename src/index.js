/**
 * Import external modules
 */
const chalk = require("chalk");
const express = require("express");

const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

// Creating a WEB SERVER
const app = express();

// Setting middlewares
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(chalk.yellow(`Server is listening to PORT ${port}...`));
});
