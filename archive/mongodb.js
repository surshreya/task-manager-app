/**
 * Import external modules
 */
const chalk = require("chalk");
const { MongoClient } = require("mongodb");

/**
 * Set up the database connection
 */
const connectionURL = process.env.MONGO_CONN_URL;
const client = new MongoClient(connectionURL);
const dbName = "task-manager-app";

main = async () => {
  try {
    // Use connect method to connect to the server
    await client.connect();
    console.log(chalk.yellow("Connected successfully to server"));

    const db = client.db(dbName);
    const collection = db.collection("users");

    // CRUD Operations
    const insertResult = await collection.insertOne({
      name: "Amelia",
      age: 14,
    });
    console.log("Inserted documents =>", insertResult);

    const filteredDocs = await collection.find({ age: 28 }).toArray();
    console.log("Found documents filtered by { age: 28 } =>", filteredDocs);

    const updateResult = await collection.updateOne(
      { age: 27 },
      { $inc: { age: 1 } }
    );
    console.log("Updated documents =>", updateResult);

    const deleteResult = await collection.deleteOne({ age: 14 });
    console.log("Deleted documents =>", deleteResult);

    return chalk.green("Done.");
  } catch (error) {
    throw chalk.red(error);
  }
};

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => {
    client.close();
    console.log(chalk.yellow("Connection closed."));
  });
