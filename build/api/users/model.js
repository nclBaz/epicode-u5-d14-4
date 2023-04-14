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
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const { Schema, model } = mongoose_1.default;
const UsersSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["Admin", "User"], default: "User" },
}, { timestamps: true });
// BEFORE saving the user in db, I'd like to execute the following code
UsersSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        // This code will be automagically executed BEFORE saving
        // Here I am not using an arrow function as I normally do, because of the "this" keyword
        const newUserData = this; // If I use arrow functions, "this" will be undefined, it contains the new user's data in case of normal functions
        if (newUserData.isModified("password")) {
            // I can save some precious CPU cycles if I execute hash function ONLY whenever the user is modifying his password (or if the user is being created)
            const plainPW = newUserData.password;
            const hash = yield bcrypt_1.default.hash(plainPW, 11);
            newUserData.password = hash;
        }
    });
});
UsersSchema.methods.toJSON = function () {
    // This .toJSON method is called EVERY TIME Express does a res.send(user/users)
    // This does mean that we could override the default behaviour of this method, by writing some code that removes passwords (and also some unnecessary things as well) from users
    const currentUserDocument = this;
    const currentUser = currentUserDocument.toObject();
    delete currentUser.password;
    delete currentUser.createdAt;
    delete currentUser.updatedAt;
    delete currentUser.__v;
    return currentUser;
};
UsersSchema.static("checkCredentials", function (email, plainPW) {
    return __awaiter(this, void 0, void 0, function* () {
        // My own custom method attached to the UsersModel
        // Given email and plain text password, this method should check in the db if the user exists (by email)
        // Then it should compare the given password with the hashed one coming from the db
        // Then it should return an useful response
        // 1. Find by email
        const user = yield this.findOne({ email });
        if (user) {
            // 2. If the user is found --> compare plainPW with the hashed one
            const passwordMatch = yield bcrypt_1.default.compare(plainPW, user.password);
            if (passwordMatch) {
                // 3. If passwords match --> return user
                return user;
            }
            else {
                // 4. If they don't --> return null
                return null;
            }
        }
        else {
            // 5. In case of also user not found --> return null
            return null;
        }
    });
});
exports.default = model("user", UsersSchema);
