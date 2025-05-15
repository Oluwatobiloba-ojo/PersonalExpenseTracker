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
const message_1 = require("../error/message");
const crypto_1 = require("crypto");
class UserService {
    constructor() {
        this.users = user_repository_1.userRepository;
    }
    createUser(request) {
        return __awaiter(this, void 0, void 0, function* () {
            request.action_type = "create_user";
            const error = yield (0, class_validator_1.validate)(request);
            const isError = error.length > 0;
            if (isError) {
                const errorResponse = (0, formatter_1.formatError)(error);
                throw new app_error_1.AppError(JSON.stringify(errorResponse), errorResponse.statusCode);
            }
            if (yield this.isExistingUser(request))
                throw new app_error_1.AppError(message_1.USER_ALREADY_EXIST, 400);
            var user = mapper_1.mapper.map(request, user_1.UserDto, user_model_1.User);
            user = yield this.users.save(user);
            return mapper_1.mapper.map(user, user_model_1.User, user_1.UserDto);
        });
    }
    createPassword(request) {
        return __awaiter(this, void 0, void 0, function* () {
            request.action_type = "create_password";
            const error = yield (0, class_validator_1.validate)(request);
            const isError = error.length > 0;
            if (isError) {
                const errorResponse = (0, formatter_1.formatError)(error);
                throw new app_error_1.AppError(JSON.stringify(errorResponse), errorResponse.statusCode);
            }
            if (!(yield this.isExistingUser(request)))
                throw new app_error_1.AppError(message_1.USER_DOES_NOT_EXIST, 400);
            else if (yield this.isPasswordExisting(request)) {
                throw new app_error_1.AppError("Password already exists", 400);
            }
            ;
            const hashedPassword = (0, crypto_1.hash)("sha256", request.password);
            yield this.users.update({ id: request.id }, { password: hashedPassword });
            const updatedUser = yield this.users.findOne({ where: { id: request.id } });
            return mapper_1.mapper.map(updatedUser, user_model_1.User, user_1.UserDto);
        });
    }
    getUserById(id) {
        throw new Error("Method not implemented.");
    }
    getAllUsers() {
        throw new Error("Method not implemented.");
    }
    updateUser(request) {
        throw new Error("Method not implemented.");
    }
    deleteUser(id) {
        throw new Error("Method not implemented.");
    }
    isExistingUser(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (request.id) {
                return yield this.users.existsBy({ id: request.id });
            }
            else if (request.email) {
                return yield this.users.existsBy({ email: request.email });
            }
            return false;
        });
    }
    isPasswordExisting(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (request.id) {
                const user = yield this.users.findOneBy({ id: request.id });
                console.log("User in is password existing", (user === null || user === void 0 ? void 0 : user.password) !== null);
                return (user === null || user === void 0 ? void 0 : user.password) !== null;
            }
            else if (request.email) {
                const user = yield this.users.findOneBy({ email: request.email });
                return (user === null || user === void 0 ? void 0 : user.password) !== null;
            }
            return false;
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user_service.js.map