const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");

const { userOne, setupDatabase, userOneID } = require("./fixtures/db");

beforeEach(setupDatabase);

/**
 * TEST - Create a new user
 */
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

/**
 * TEST - Login an existing user
 */
test("Should login an existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(userOneID);
  expect(response.body.token).toBe(user.tokens[1].token);
});

/**
 * TEST - Should not login a non-existing user
 */
test("Should not login a non-existing user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: "hi45",
    })
    .expect(500);
});

/**
 * TEST - Should get the user's profile
 */
test("Should get the user's profile", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

/**
 * TEST - Should not get an authorized user's profile
 */
test("Should not get an authorized user's profile", async () => {
  await request(app).get("/users/me").send().expect(401);
});

/**
 * TEST - Account deletion of user
 */
test("Account deletion of user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneID);
  expect(user).toBeNull();
});

/**
 * TEST - Should NOT delete account of an authorized user
 */
test("Account deletion of user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

/**
 * TEST - Should update valid user fields
 */
test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ name: "Jessica" })
    .expect(200);

  const user = await User.findById(userOneID);
  expect(user.name).toEqual("Jessica");
});

/**
 * TEST - Should NOT update invalid user fields
 */
test("Should NOT update invalid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ location: "USA" })
    .expect(400);
});
