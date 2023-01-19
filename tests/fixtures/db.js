const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

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

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "Task 1",
  completed: true,
  author: userOne._id,
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: "Task 2",
  completed: false,
  author: userOne._id,
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: "Task 3",
  completed: true,
  author: userTwo._id,
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  userOne,
  userOneID,
  userTwo,
  userTwoID,
  setupDatabase,
};
