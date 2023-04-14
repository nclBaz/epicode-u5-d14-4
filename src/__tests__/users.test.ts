import supertest from "supertest"
import dotenv from "dotenv"
import mongoose from "mongoose"
import { expressServer } from "../server"
import UsersModel from "../api/users/model"

dotenv.config()

const client = supertest(expressServer)

const validUser = {
  firstName: "blabla",
  lastName: "asdasd",
  email: "bla@gmail.com",
  password: "1234",
}

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL!)
  const user = new UsersModel(validUser)
  await user.save()
}) // beforeAll is a Jest hook which will be ran before all tests, usually this is used to connect to db and to do some initial setup like adding some mock data to the db

afterAll(async () => {
  await UsersModel.deleteMany()
  await mongoose.connection.close()
}) // afterAll hook could to clean up the situation (close the connection to Mongo gently and clean up db/collections)

let accessToken: string

describe("Test Users Endpoints", () => {
  it("Should test that POST /users returns 201 and an _id if a valid product is provided in req.body", async () => {
    const response = await client.post("/users").send(validUser).expect(201)
    expect(response.body._id).toBeDefined()
  })

  it("Should test that POST /users/login with the right credentials gives you back an access token", async () => {
    const response = await client.post("/users/login").send(validUser)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("accessToken")
    accessToken = response.body.accessToken
  })

  it("Should test that GET /users returns 401 if you don't provide an access token", async () => {
    await client.get("/users").expect(401)
  })

  it("Should test that GET /users returns 403 if you provide an access token but you are not an admin", async () => {
    await client.get("/users").set("Authorization", `Bearer ${accessToken}`).expect(403)
  })
})
