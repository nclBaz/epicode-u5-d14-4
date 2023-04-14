"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// By default Jest does not work with the import syntax
// If you want to use import syntax you should add NODE_OPTIONS=--experimental-vm-modules to the test script in package.json
// On Windows you cannot use NODE_OPTIONS (as well as other env vars in scripts) from the command line --> solution is to use cross-env in order to be able to pass
// env vars to command line scripts on all operative systems!
const supertest_1 = __importDefault(require("supertest"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const server_1 = require("../server");
const model_1 = __importDefault(require("../api/products/model"));
dotenv_1.default.config(); // This command forces .env vars to be loaded into process.env. This is the way to go when you can't use -r dotenv/config
// supertest is capable of running server.listen from our Express app if we pass the server to it
// It will give us back an object (client) that can be used to run http requests on that server
const client = (0, supertest_1.default)(server_1.expressServer);
const validProduct = {
    name: "iPhone",
    description: "Good phone",
    price: 10000,
};
const notValidProduct = {
    description: "Good phone",
    price: 10000,
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(process.env.MONGO_TEST_URL);
    const product = new model_1.default(validProduct);
    yield product.save();
})); // beforeAll is a Jest hook which will be ran before all tests, usually this is used to connect to db and to do some initial setup like adding some mock data to the db
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield model_1.default.deleteMany();
    yield mongoose_1.default.connection.close();
})); // afterAll hook could to clean up the situation (close the connection to Mongo gently and clean up db/collections)
describe("Test Products APIs", () => {
    // it("Should test that GET /test endpoint returns 200 and a body containing a message", async () => {
    //   const response = await client.get("/test")
    //   expect(response.status).toBe(200)
    //   expect(response.body.message).toEqual("TEST SUCCESSFULL")
    // })
    it("Should test that env vars are loaded correctly", () => {
        expect(process.env.MONGO_TEST_URL).toBeDefined();
    });
    it("Should test that POST /products returns 201 and an _id if a valid product is provided in req.body", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield client.post("/products").send(validProduct).expect(201);
        expect(response.body._id).toBeDefined();
    }));
    it("Should test that POST /products returns 400 if a not valid product is provided in req.body", () => __awaiter(void 0, void 0, void 0, function* () {
        yield client.post("/products").send(notValidProduct).expect(400);
    }));
    it("Should test that GET /products returns 200 and a body", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield client.get("/products").expect(200);
        console.log(response.body);
    }));
});
