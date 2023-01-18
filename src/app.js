/**
 * Import external modules
 */
const express = require("express");

const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

// Creating a WEB SERVER
const app = express();

// Setting middlewares
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
