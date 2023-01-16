const express = require("express");
require("../db/mongoose");

const User = require("../models/user");

/**
 * Setting up Router
 */
const router = new express.Router();

// Creates a new user for the app
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Login to access the API
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Fetches all the users
router.get("/users", async (_, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Fetches a particular the user
router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Updates a particular the user
router.patch("/users/:id", async (req, res) => {
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
    const user = await User.findById(id);

    updates.forEach((update) => {
      user[update] = body[update];
    });

    await user.save();
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Deletes a particular the user
router.delete("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
