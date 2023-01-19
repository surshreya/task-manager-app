const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");

const { userOneId, userOne, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Andrew Mead",
      email: "andrewmead@gmail.com",
      password: "myPass777!",
    })
    .expect(201);

  //Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  //Assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: "Andrew Mead",
      email: "andrewmead@gmail.com",
    },
    token: user.tokens[0].token,
  });
});
