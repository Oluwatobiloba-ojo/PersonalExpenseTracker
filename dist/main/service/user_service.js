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
exports.UserService = void 0;
const class_validator_1 = require("class-validator");
const user_1 = require("../dto/request/user");
const formatter_1 = require("../utils/formatter");
const app_error_1 = require("../error/app_error");
const mapper_1 = require("../mapper/mapper");
const user_model_1 = require("../data/entity/user_model");
const user_repository_1 = require("../data/repository/user.repository");
class UserService {
    constructor() {
        this.users = user_repository_1.userRepository;
    }
    createUser(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const error = yield (0, class_validator_1.validate)(request);
            if (error.length > 0) {
                const errorResponse = yield (0, formatter_1.formatError)(error);
                console.log("Error format is this ", errorResponse);
                throw new app_error_1.AppError(JSON.stringify(errorResponse), errorResponse.statusCode);
            }
            var user = mapper_1.mapper.map(request, user_1.UserDto, user_model_1.User);
            console.log("user is this ", user);
            user = yield this.users.save(user);
            return mapper_1.mapper.map(user, user_model_1.User, user_1.UserDto);
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user_service.js.map