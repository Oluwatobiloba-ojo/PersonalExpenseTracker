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
const otp_generator_service_1 = require("./otp_generator_service");
const node_mailer_service_1 = require("./node_mailer_service");
const jwt_auth_service_1 = require("./jwt_auth_service");
class UserService {
    constructor() {
        this.users = user_repository_1.userRepository;
        this.otpService = new otp_generator_service_1.otpGeneratorService();
        this.emailService = new node_mailer_service_1.NodeMailerService();
        this.auth_service = new jwt_auth_service_1.JwtService();
    }
    createUser(request) {
        return __awaiter(this, void 0, void 0, function* () {
            request.action_type = "create_user";
            console.log("Entered here => ", request);
            yield this.validateRequest(request);
            console.log("Done validating ", request);
            if (yield this.isExistingUser(request))
                throw new app_error_1.AppError(message_1.USER_ALREADY_EXIST, 400);
            console.log("Done verifying if user exist");
            var user = mapper_1.mapper.map(request, user_1.UserDto, user_model_1.User);
            console.log("Done mapping user ", user);
            user = yield this.users.save(user);
            console.log("Done saving user ", user);
            return mapper_1.mapper.map(user, user_model_1.User, user_1.UserDto);
        });
    }
    createPassword(request) {
        return __awaiter(this, void 0, void 0, function* () {
            request.action_type = "create_password";
            yield this.validateRequest(request);
            if (!(yield this.isExistingUser(request)))
                throw new app_error_1.AppError(message_1.USER_DOES_NOT_EXIST, 400);
            else if (yield this.isPasswordExisting(request)) {
                throw new app_error_1.AppError(message_1.PASSWORD_ALREADY_EXIST, 400);
            }
            ;
            yield this.users.update({ id: request.id }, { password: (0, crypto_1.hash)("sha256", request.password) });
            return mapper_1.mapper.map(yield this.users.findOne({ where: { id: request.id } }), user_model_1.User, user_1.UserDto);
        });
    }
    updateUser(request) {
        return __awaiter(this, void 0, void 0, function* () {
            request.action_type = "update_user";
            yield this.validateRequest(request);
            if (!(yield this.isExistingUser(request)))
                throw new app_error_1.AppError(message_1.USER_DOES_NOT_EXIST, 400);
            yield this.users.update({ id: request.id }, { first_name: request.first_name, last_name: request.last_name, phone_number: request.phone_number });
            const updatedUser = yield this.users.findOne({ where: { id: request.id } });
            return mapper_1.mapper.map(updatedUser, user_model_1.User, user_1.UserDto);
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new app_error_1.AppError(message_1.ID_REQUIRED, 400);
            }
            const foundUser = yield this.users.findOne({ where: { id: id } });
            if (!foundUser)
                throw new app_error_1.AppError(message_1.USER_DOES_NOT_EXIST, 400);
            return mapper_1.mapper.map(foundUser, user_model_1.User, user_1.UserDto);
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.users.find({ where: { is_active: true } });
            return users.map(user => mapper_1.mapper.map(user, user_model_1.User, user_1.UserDto));
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new app_error_1.AppError(message_1.ID_REQUIRED, 400);
            }
            var foundUser = yield this.users.findOne({ where: { id: id } });
            if (!foundUser)
                return;
            if (foundUser.is_active) {
                yield this.users.update({ id: id }, { is_active: false });
                return;
            }
        });
    }
    login(request) {
        return __awaiter(this, void 0, void 0, function* () {
            request.action_type = "login";
            yield this.validateRequest(request);
            if (!(yield this.isExistingUser(request)))
                throw new app_error_1.AppError(message_1.USER_DOES_NOT_EXIST, 400);
            var user = yield this.users.findOne({ where: { email: request.email } });
            var passwordIsNotMatch = (user === null || user === void 0 ? void 0 : user.password) !== (0, crypto_1.hash)("sha256", request.password);
            if (passwordIsNotMatch) {
                throw new app_error_1.AppError("Invalid credentials", 401);
            }
            if (!user.is_enabled) {
                return yield this.sendMailOtp(user);
            }
            else {
                return yield this.accessToken(user);
            }
        });
    }
    initLogin(request) {
        return __awaiter(this, void 0, void 0, function* () {
            request.action_type = "init_login";
            yield this.validateRequest(request);
            if (!(yield this.isExistingUser(request)))
                throw new app_error_1.AppError(message_1.USER_DOES_NOT_EXIST, 400);
            var foundUser = yield this.users.findOne({ where: { email: request.email } });
            console.log("FOund user is this ", foundUser);
            var isCredientialValid = yield this.otpService.verify(foundUser.id, request.otp);
            if (!isCredientialValid)
                throw new app_error_1.AppError(message_1.INVALID_CREDIENTIALS, 400);
            foundUser.is_enabled = true;
            yield this.users.update({ id: foundUser.id }, { is_enabled: true });
            var newToken = yield this.auth_service.generateToken(foundUser.id);
            request = mapper_1.mapper.map(foundUser, user_model_1.User, user_1.UserDto);
            request.access_token = newToken;
            return request;
        });
    }
    accessToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            var token = yield this.auth_service.generateToken(user.id);
            console.log("Token is this ", token);
            var userDto = mapper_1.mapper.map(user, user_model_1.User, user_1.UserDto);
            userDto.access_token = token;
            return userDto;
        });
    }
    sendMailOtp(user) {
        return __awaiter(this, void 0, void 0, function* () {
            var otp = yield this.otpService.generate(user.id);
            console.log("Otp is this ", otp);
            var message = `<h1>Please confirm your email </h1>
                        <p> here is your OTP code:-> ${otp} </p>`;
            yield this.emailService.sendEmail(user.email, "Your OTP Code", message);
            return mapper_1.mapper.map(user, user_model_1.User, user_1.UserDto);
        });
    }
    validateRequest(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const error = yield (0, class_validator_1.validate)(request);
            const isError = error.length > 0;
            if (isError) {
                const errorResponse = (0, formatter_1.formatError)(error);
                throw new app_error_1.AppError(JSON.stringify(errorResponse), errorResponse.statusCode);
            }
        });
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