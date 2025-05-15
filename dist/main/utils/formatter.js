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
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatError = formatError;
const response_1 = require("../error/response");
function formatError(validationErrors) {
    return __awaiter(this, void 0, void 0, function* () {
        var messageData = new Map();
        validationErrors.forEach((error) => {
            var value = messageData.get(error.property);
            if (!value) {
                var message = getMessage(error.constraints);
                messageData.set(error.property, message);
            }
        });
        const plainMessageObject = Object.fromEntries(messageData);
        return (0, response_1.errorResponse)(plainMessageObject, 400);
    });
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