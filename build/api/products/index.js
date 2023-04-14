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
const productsRouter = express_1.default.Router();
productsRouter.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newResource = new model_1.default(req.body);
        const { _id } = yield newResource.save();
        res.status(201).send({ _id });
    }
    catch (error) {
        next(error);
    }
}));
productsRouter.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resources = yield model_1.default.find();
        res.send(resources);
    }
    catch (error) {
        next(error);
    }
}));
productsRouter.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resource = yield model_1.default.findById(req.params.id);
        if (resource) {
            res.send(resource);
        }
        else {
            next((0, http_errors_1.default)(404, `Resource with id ${req.params.id} not found!`));
        }
    }
    catch (error) {
        next(error);
    }
}));
productsRouter.put("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedResource = yield model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (updatedResource) {
            res.send(updatedResource);
        }
        else {
            next((0, http_errors_1.default)(404, `Resource with id ${req.params.id} not found!`));
        }
    }
    catch (error) {
        next(error);
    }
}));
productsRouter.delete("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedResource = yield model_1.default.findByIdAndUpdate(req.params.id);
        if (deletedResource) {
            res.status(204).send();
        }
        else {
            next((0, http_errors_1.default)(404, `Resource with id ${req.params.id} not found!`));
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.default = productsRouter;
