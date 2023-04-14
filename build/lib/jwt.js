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
exports.JWTAuthMiddleware = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const tools_js_1 = require("./tools.js");
const JWTAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Check if authorization header is in the request, if it is not --> 401
    if (!req.headers.authorization) {
        next((0, http_errors_1.default)(401, "Please provide Bearer token in authorization header"));
    }
    else {
        // 2. If authorization header is there, we should extract the token out of it
        // Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDJkMzhhN2ZhN2JlYTgxYmYyZGU2NDgiLCJyb2xlIjoiVXNlciIsImlhdCI6MTY4MDY4NTQ0NiwiZXhwIjoxNjgxMjkwMjQ2fQ.V9rVYh0BrOOwvqeI2YdeCBwEZL4RlEOrQoQ9Mv0Z3Mo"
        const accessToken = req.headers.authorization.replace("Bearer ", "");
        try {
            // 3. Verify the token (check the integrity and check expiration date)
            const payload = yield (0, tools_js_1.verifyAccessToken)(accessToken);
            // 4. If everything is fine we should get back the payload and no errors should be thrown --> next
            req.user = { _id: payload._id, role: payload.role };
            next();
            // 5. If the token is NOT ok for any reason, or in any case jsonwebtoken will throw any error --> 401
        }
        catch (error) {
            console.log(error);
            next((0, http_errors_1.default)(401, "Token not valid! Please log in again!"));
        }
    }
});
exports.JWTAuthMiddleware = JWTAuthMiddleware;
