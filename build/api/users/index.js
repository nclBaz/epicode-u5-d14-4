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
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const model_1 = __importDefault(require("./model"));
const jwt_1 = require("../../lib/auth/jwt");
const admin_1 = require("../../lib/auth/admin");
const tools_1 = require("../../lib/auth/tools");
const usersRouter = express_1.default.Router();
usersRouter.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = new model_1.default(req.body);
        const { _id } = yield newUser.save();
        res.status(201).send({ _id });
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.get("/", jwt_1.JWTAuthMiddleware, admin_1.adminOnlyMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield model_1.default.find({});
        res.send(users);
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.get("/me", jwt_1.JWTAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield model_1.default.findById(req.user._id);
        res.send(user);
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.put("/me", jwt_1.JWTAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield model_1.default.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true });
        res.send(updatedUser);
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.delete("/me", jwt_1.JWTAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield model_1.default.findOneAndDelete(req.user._id);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.get("/:id", jwt_1.JWTAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield model_1.default.findById(req.params.id);
        if (user) {
            res.send(user);
        }
        else {
            next((0, http_errors_1.default)(404, `User with id ${req.params.id} not found!`));
        }
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.put("/:id", jwt_1.JWTAuthMiddleware, admin_1.adminOnlyMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedResource = yield model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (updatedResource) {
            res.send(updatedResource);
        }
        else {
            next((0, http_errors_1.default)(404, `User with id ${req.params.id} not found!`));
        }
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.delete("/:id", jwt_1.JWTAuthMiddleware, admin_1.adminOnlyMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedResource = yield model_1.default.findByIdAndDelete(req.params.id);
        if (deletedResource) {
            res.status(204).send();
        }
        else {
            next((0, http_errors_1.default)(404, `User with id ${req.params.id} not found!`));
        }
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Obtain credentials from req.body
        const { email, password } = req.body;
        // 2. Verify the credentials
        const user = yield model_1.default.checkCredentials(email, password);
        if (user) {
            // 3.1 If credentials are fine --> create an access token (JWT) and send it back as a response
            const payload = { _id: user._id, role: user.role };
            const accessToken = yield (0, tools_1.createAccessToken)(payload);
            res.send({ accessToken });
        }
        else {
            // 3.2 If they are not --> trigger a 401 error
            next((0, http_errors_1.default)(401, "Credentials are not ok!"));
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.default = usersRouter;
