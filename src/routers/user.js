const express = require("express");
const auth = require("../middlewares/auth");
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

// Logout the user from the API
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

// Logout the user from all sessions from the API
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

// Fetch user profile
router.get("/users/me", auth, (req, res) => {
  res.status(200).send(req.user);
});

// Updates a particular the user
router.patch("/users/me", auth, async (req, res) => {
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
    updates.forEach((update) => {
      req.user[update] = body[update];
    });

    await req.user.save();
    res.status(200).send(req.user);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Deletes a particular the user
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.status(200).send(req.user);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
