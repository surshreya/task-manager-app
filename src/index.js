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
app.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/tasks", async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

/**
 * Reading endpoints
 */
app.get("/users", async (_, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/tasks", async (_, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).send(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findById(_id);
    if (!task) {
      return res.status(404).send();
    }
    res.status(200).send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

/**
 * Updating Endpoints
 */
app.patch("/users/:id", async (req, res) => {
  const body = req.body;
  const updates = Object.keys(body);
  const allowedUpdates = ["name", "age", "email", "password"];
  const validOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!validOperation) {
    res.status(400).send({ error: "Invalid updates" });
  }

  try {
    const id = req.params.id;
    const user = await User.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.patch("/tasks/:id", async (req, res) => {
  const body = req.body;
  const updates = Object.keys(body);
  const allowedUpdates = ["description", "completed"];
  const validOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!validOperation) {
    res.status(400).send({ error: "Invalid updates" });
  }

  try {
    const id = req.params.id;
    const task = await Task.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    res.status(200).send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

/**
 * Deletion Endpoints
 */
app.delete("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findByIdAndDelete(_id);
    if (!task) {
      return res.status(404).send();
    }
    res.status(200).send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(chalk.yellow(`Server is listening to PORT ${port}...`));
});
