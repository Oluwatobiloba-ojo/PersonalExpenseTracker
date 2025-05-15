"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatError = formatError;
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
//# sourceMappingURL=formatter.js.map