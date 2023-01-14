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

// Setting up routes

/**
 * Creation endpoints
 */
app.post("/users", (req, res) => {
  const user = new User(req.body);

  user
    .save()
    .then(() => {
      res.status(201).send(user);
    })
    .catch((error) => {
      res.status(500).send(err);
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
      res.status(500).send(err);
    });
});

/**
 * Reading endpoints
 */
app.get("/users", (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.get("/users/:id", (req, res) => {
  const _id = req.params.id;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        res.status(404).send();
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.get("/tasks", (req, res) => {
  Task.find({})
    .then((tasks) => {
      res.status(200).send(tasks);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.get("/tasks/:id", (req, res) => {
  const _id = req.params.id;
  Task.findById(_id)
    .then((task) => {
      if (!task) {
        res.status(404).send();
      }
      res.status(200).send(task);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(chalk.yellow(`Server is listening to PORT ${port}...`));
});
