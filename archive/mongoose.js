const mongoose = require("mongoose");
const chalk = require("chalk");
const validator = require("validator");

const dbName = "task-manager-app";
const connectionURL = `${process.env.MONGOOSE_CONN_URL}${dbName}`;

const User = mongoose.model("User", {
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be a positive number");
      }
    },
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid.");
      }
    },
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 7,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Password cannot contain the word `password`");
      }
    },
  },
});

const me = new User({
  name: "    Rick",
  email: "RICK@MEAD.IO",
  password: "password",
});

const Task = mongoose.model("Task", {
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const task = new Task({
  description: "Learn microservices",
  completed: false,
});

main = async () => {
  try {
    // Use connect method to connect to the server
    mongoose.set("strictQuery", false);
    await mongoose.connect(connectionURL);
    console.log(chalk.yellow("Connected successfully to server"));

    me.save()
      .then(() => {
        console.log(me);
      })
      .catch((err) => {
        throw err;
      });

    return chalk.green("Done.");
  } catch (error) {
    throw chalk.red(error);
  }
};

main().then(console.log).catch(console.error);
