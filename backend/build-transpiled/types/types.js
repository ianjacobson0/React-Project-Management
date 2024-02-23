"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessage = void 0;
const getErrorMessage = msg => {
    switch (msg) {
        case "EMAIL_NOT_FOUND":
            return { message: "Email not found", statusCode: 401 };
        case "INCORRECT_PASSWORD":
            return { message: "Incorrect password", statusCode: 401 };
        default:
            return { message: msg, statusCode: 500 };
    }
};
exports.getErrorMessage = getErrorMessage;