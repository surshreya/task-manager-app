const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user");

// Mock User 1
const userOneID = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneID,
  name: "Mike",
  email: "mikey@yahoo.co.in",
  password: "Max007#re",
  age: 47,
  tokens: [
    {
      token: jwt.sign({ _id: userOneID.toString() }, process.env.JWT_SECRET),
    },
  ],
};

// Mock User 2
const userTwoID = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoID,
  name: "Penny",
  email: "penny@example.com",
  password: "45pennyHj@!",
  age: 18,
  tokens: [
    {
      token: jwt.sign({ _id: userTwoID.toString() }, process.env.JWT_SECRET),
    },
  ],
};

const setupDatabase = async () => {
  await User.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
};

module.exports = {
  userOne,
  userOneID,
  userTwo,
  userTwoID,
  setupDatabase,
};
