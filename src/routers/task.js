const express = require("express");
const auth = require("../middlewares/auth");
require("../db/mongoose");

const Task = require("../models/task");

/**
 * Setting up Router
 */
const router = new express.Router();

// Creates a new task for the app
router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    author: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Fetches all the tasks created by a user
router.get("/tasks", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ author: req.user._id });
    res.status(200).send(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Fetches a particular the task created by the user
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, author: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    res.status(200).send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Updates a particular task by the user
router.patch("/tasks/:id", auth, async (req, res) => {
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
    const task = await Task.findOne({
      _id: req.params.id,
      author: req.user._id,
    });

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => {
      task[update] = body[update];
    });

    await task.save();
    res.status(200).send(task);

    res.status(200).send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Deletes a particular task
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.status(200).send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
