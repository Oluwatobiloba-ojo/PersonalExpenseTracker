"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = void 0;
const errorResponse = (message, statusCode) => {
    return {
        status: 'error',
        message,
        statusCode
    };
};
exports.errorResponse = errorResponse;
//# sourceMappingURL=response.js.map