const request = require("supertest");
const app = require("../src/app");

test("Should signup a new user", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "Andrew Mead",
      email: "andrewmead@gmail.com",
      password: "myPass777!",
    })
    .expect(201);
});
