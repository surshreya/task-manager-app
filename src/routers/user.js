const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const auth = require("../middlewares/auth");
const { sendWelcomeMail, sendCancelMail } = require("../emails/mail");
require("../db/mongoose");

const User = require("../models/user");

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      return cb(new Error("Please upload an image file."));
    }
    cb(undefined, true);
  },
});
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
    // sendWelcomeMail(user.name, user.email);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Add an avatar
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.status(200).send();
  },
  (error, _, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

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

// Fetch user profile
router.get("/users/me/avatar", auth, (req, res) => {
  if (!req.user || !req.user.avatar) {
    return res.status(400).send();
  }

  res.set("Content-Type", "image/png");
  res.send(req.user.avatar);
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
    // sendCancelMail(req.user.name, req.user.email);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Delete an avatar
router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.status(200).send();
});

module.exports = router;
