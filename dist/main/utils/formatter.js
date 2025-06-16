"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatError = formatError;
exports.formatErrorResponse = formatErrorResponse;
const response_1 = require("../error/response");
function formatError(validationErrors) {
    const messageData = new Map(validationErrors
        .filter((error) => !!error.constraints)
        .map((error) => [error.property, getMessage(error.constraints)]));
    const plainMessageObject = Object.fromEntries(messageData);
    return (0, response_1.errorResponse)(plainMessageObject, 400);
}
function getMessage(messages) {
    if (Object.keys(messages).length == 1) {
        return Object.values(messages)[0];
    }
    else {
        for (var key in messages) {
            if (key == "isNotEmpty") {
                return messages[key];
            }
        }
        return "";
    }
}
function formatErrorResponse(error) {
    return {
        "body": typeof (error.message) === "string" ? error.message : JSON.parse(error.message)
    };
}
//# sourceMappingURL=formatter.js.map