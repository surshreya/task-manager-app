/**
 * Import external modules
 */
const chalk = require("chalk");
const app = require("./app");

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(chalk.yellow(`Server is listening to PORT ${port}...`));
});
