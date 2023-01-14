/**
 * Import external modules
 */
const chalk = require("chalk");
const express = require("express");

require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");

// Creating a WEB SERVER
const app = express();

// Setting middlewares
app.use(express.json());

// Creating routes
app.post("/users", (req, res) => {
  const user = new User(req.body);

  user
    .save()
    .then(() => {
      res.status(201).send(user);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

app.post("/tasks", (req, res) => {
  const task = new Task(req.body);

  task
    .save()
    .then(() => {
      res.status(201).send(task);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(chalk.yellow(`Server is listening to PORT ${port}...`));
});
