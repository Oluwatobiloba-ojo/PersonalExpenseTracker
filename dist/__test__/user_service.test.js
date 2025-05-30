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
const user_1 = require("../main/dto/request/user");
const user_mapper_1 = require("../main/mapper/user_mapper");
const user_service_1 = require("../main/service/user_service");
const mapper_1 = require("../main/mapper/mapper");
const user_repository_1 = require("../main/data/repository/user.repository");
const user_model_1 = require("../main/data/entity/user_model");
const crypto_1 = require("crypto");
require("reflect-metadata");
const otp_generator_service_1 = require("../main/service/otp_generator_service");
const node_mailer_service_1 = require("../main/service/node_mailer_service");
const message_1 = require("../main/error/message");
jest.mock("../main/data/repository/user.repository");
jest.mock("../main/service/otp_generator_service");
jest.mock("../main/service/node_mailer_service");
describe("User service Test: ", () => {
    let userService;
    let generateOtpService;
    let emailService;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        (0, user_mapper_1.createUserMappings)();
        userService = new user_service_1.UserService();
        generateOtpService = new otp_generator_service_1.otpGeneratorService();
        emailService = new node_mailer_service_1.NodeMailerService();
        userService.otpService = generateOtpService;
        userService.emailService = emailService;
    }));
    describe("Test create user if the necessary element", () => {
        it("should throw an exception saying required data needed", () => __awaiter(void 0, void 0, void 0, function* () {
            var userDto = new user_1.UserDto();
            const responseErro = {
                status: 'error',
                message: {
                    'first_name': 'First name is required',
                    'last_name': 'Last name is required',
                    'email': 'Email is required'
                }, statusCode: 400
            };
            yield expect(userService.createUser(userDto)).rejects.toThrow(JSON.stringify(responseErro));
        }));
    });
    describe("Test create user if the email is not valid", () => {
        it("Should throw invalid email ", () => __awaiter(void 0, void 0, void 0, function* () {
            var userDto = new user_1.UserDto();
            userDto.first_name = "oluwatobi";
            userDto.last_name = "ojo";
            userDto.email = "wrongEmail";
            const responseError = {
                status: 'error',
                message: {
                    'email': 'Email must be a valid email address.'
                }, statusCode: 400
            };
            yield expect(userService.createUser(userDto)).rejects.toThrow(JSON.stringify(responseError));
        }));
    });
    describe("Test create user if the both lastname is not given ", () => {
        it("Should throw last name required ", () => __awaiter(void 0, void 0, void 0, function* () {
            var userDto = new user_1.UserDto();
            userDto.first_name = "oluwatobi";
            userDto.email = "ojot630@gmail.com";
            const responseError = {
                status: 'error',
                message: {
                    'last_name': 'Last name is required'
                }, statusCode: 400
            };
            yield expect(userService.createUser(userDto)).rejects.toThrow(JSON.stringify(responseError));
        }));
    });
    describe("Test create user if the lastname is empty ", () => {
        it("Should throw exception ", () => __awaiter(void 0, void 0, void 0, function* () {
            var userDto = new user_1.UserDto();
            userDto.first_name = "oluwatobi";
            userDto.last_name = "";
            userDto.email = "ojot630@gmail.com";
            const responseError = {
                status: 'error',
                message: {
                    'last_name': 'Last name is required'
                }, statusCode: 400
            };
            yield expect(userService.createUser(userDto)).rejects.toThrow(JSON.stringify(responseError));
        }));
    });
    describe("Test create user with invalid phone number ", () => {
        it("Should throw an error that phone number does not match ", () => __awaiter(void 0, void 0, void 0, function* () {
            var userDto = new user_1.UserDto();
            userDto.first_name = "oluwatobi";
            userDto.last_name = "ojo";
            userDto.email = "ojot630@gmail.com";
            userDto.phone_number = "12345678901234567890";
            const responseError = {
                status: 'error',
                message: {
                    'phone_number': 'Phone number must be a valid phone number.'
                }, statusCode: 400
            };
            yield expect(userService.createUser(userDto)).rejects.toThrow(JSON.stringify(responseError));
        }));
    });
    describe("Test create user with valid data ", () => {
        it("Should create the user called user repository to create", () => __awaiter(void 0, void 0, void 0, function* () {
            var userDto = new user_1.UserDto();
            userDto.first_name = "oluwatobi";
            userDto.last_name = "ojo";
            userDto.email = "ojot630@gmail.com";
            var user = mapper_1.mapper.map(userDto, user_1.UserDto, user_model_1.User);
            user.id = "1";
            user.created_at = new Date();
            user.updated_at = new Date();
            user.is_active = true;
            user_repository_1.userRepository.save.mockResolvedValueOnce(user);
            var result = yield userService.createUser(userDto);
            expect(result).not.toBeNull();
            expect(result.id).toBeTruthy();
            expect(result.email).toBe(userDto.email);
            expect(result.first_name).toBe(userDto.first_name);
            expect(result.last_name).toBe(userDto.last_name);
            expect(result.created_at).toBeTruthy();
            expect(result.updated_at).toBeTruthy();
            expect(result.is_active).toBeTruthy();
        }));
    });
    describe("Test create user with an existing user email should ", () => {
        it("Should throw an error that user already exist ", () => __awaiter(void 0, void 0, void 0, function* () {
            var userDto = new user_1.UserDto();
            userDto.first_name = "oluwatobi";
            userDto.last_name = "ojo";
            userDto.email = "ojot630@gmail.com";
            user_repository_1.userRepository.existsBy.mockResolvedValueOnce(true);
            yield expect(userService.createUser(userDto)).rejects.toThrow("User already exist");
            expect(user_repository_1.userRepository.existsBy).toHaveBeenCalledTimes(1);
            expect(user_repository_1.userRepository.existsBy).toHaveBeenCalledWith({ email: userDto.email });
        }));
    });
    describe("Test create password with an invalid data like id and password should ", () => {
        it("Should throw an error that invalid data fields required ", () => __awaiter(void 0, void 0, void 0, function* () {
            var userDto = new user_1.UserDto();
            userDto.first_name = "oluwatobi";
            userDto.last_name = "ojo";
            const responseError = {
                status: 'error',
                message: {
                    'id': 'id is required',
                    'password': 'Password is required'
                }, statusCode: 400
            };
            yield expect(userService.createPassword(userDto)).rejects.toThrow(JSON.stringify(responseError));
        }));
    });
    describe("Test create password with an the id exiting but password is not valid ", () => {
        it("Should throw an error that password is required ", () => __awaiter(void 0, void 0, void 0, function* () {
            var userDto = new user_1.UserDto();
            userDto.id = "1";
            userDto.password = "ola";
            const responseError = {
                status: 'error',
                message: {
                    'password': 'password is not strong enough'
                }, statusCode: 400
            };
            yield expect(userService.createPassword(userDto)).rejects.toThrow(JSON.stringify(responseError));
        }));
    });
    describe("Test create password if the id given is not existing", () => {
        it("Should throw an error that user does not exist ", () => __awaiter(void 0, void 0, void 0, function* () {
            var userDto = new user_1.UserDto();
            userDto.id = "1";
            userDto.password = "Ola@1234";
            user_repository_1.userRepository.existsBy.mockResolvedValueOnce(false);
            yield expect(userService.createPassword(userDto)).rejects.toThrow("User does not exist");
        }));
    });
    describe("Test create password if the id given is existing and password is valid", () => {
        it("Should create the password ", () => __awaiter(void 0, void 0, void 0, function* () {
            var userDto = new user_1.UserDto();
            userDto.id = "1";
            userDto.password = "Ola@1234";
            var exitingUser = mapper_1.mapper.map(userDto, user_1.UserDto, user_model_1.User);
            exitingUser.created_at = new Date();
            exitingUser.updated_at = new Date();
            exitingUser.is_active = true;
            user_repository_1.userRepository.existsBy.mockResolvedValueOnce(true);
            exitingUser.password = (0, crypto_1.hash)("sha256", userDto.password);
            user_repository_1.userRepository.update.mockResolvedValueOnce(exitingUser);
            user_repository_1.userRepository.findOne.mockResolvedValueOnce(exitingUser);
            exitingUser.password = null;
            user_repository_1.userRepository.findOneBy.mockResolvedValueOnce(exitingUser);
            var result = yield userService.createPassword(userDto);
            console.log("Result is this ", result);
            expect(result).not.toBeNull();
            expect(result.id).toBe(userDto.id);
            expect(result.first_name).toBe(exitingUser.first_name);
            expect(result.last_name).toBe(exitingUser.last_name);
            expect(result.email).toBe(exitingUser.email);
            expect(result.created_at).toBeTruthy();
            expect(result.updated_at).toBeTruthy();
            expect(result.is_active).toBeTruthy();
            expect(result.password).not.toBe(userDto.password);
            expect(user_repository_1.userRepository.existsBy).toHaveBeenCalledTimes(1);
            expect(user_repository_1.userRepository.existsBy).toHaveBeenCalledWith({ id: userDto.id });
            expect(user_repository_1.userRepository.findOne).toHaveBeenCalledTimes(1);
            expect(user_repository_1.userRepository.findOne).toHaveBeenCalledWith({ where: { id: userDto.id } });
        }));
    });
    describe("Test create password if the password already exist should ", () => {
        it("Should throw an error that password already exist ", () => __awaiter(void 0, void 0, void 0, function* () {
            var userDto = new user_1.UserDto();
            userDto.id = "1";
            userDto.password = "Ola@1234";
            user_repository_1.userRepository.existsBy.mockResolvedValueOnce(true);
            user_repository_1.userRepository.findOneBy.mockResolvedValueOnce(userDto);
            yield expect(userService.createPassword(userDto)).rejects.toThrow("Password already exist");
            expect(user_repository_1.userRepository.existsBy).toHaveBeenCalledTimes(1);
            expect(user_repository_1.userRepository.existsBy).toHaveBeenCalledWith({ id: userDto.id });
            expect(user_repository_1.userRepository.findOneBy).toHaveBeenCalledTimes(1);
            expect(user_repository_1.userRepository.findOneBy).toHaveBeenCalledWith({ id: userDto.id });
        }));
    });
    describe("Test update user if the id is not given", () => {
        it("Should throw an error that id is required ", () => __awaiter(void 0, void 0, void 0, function* () {
            var userDto = new user_1.UserDto();
            userDto.first_name = "oluwatobi";
            userDto.last_name = "ojo";
            const responseError = {
                status: 'error',
                message: {
                    'id': 'id is required'
                }, statusCode: 400
            };
            yield expect(userService.updateUser(userDto)).rejects.toThrow(JSON.stringify(responseError));
        }));
    });
    describe("Test update user if the id is not existing ", () => {
        it("Should throw an error that user does not exist ", () => __awaiter(void 0, void 0, void 0, function* () {
            var userDto = new user_1.UserDto();
            userDto.id = "1";
            userDto.first_name = "oluwatobi";
            userDto.last_name = "ojo";
            user_repository_1.userRepository.existsBy.mockResolvedValueOnce(false);
            yield expect(userService.updateUser(userDto)).rejects.toThrow("User does not exist");
        }));
    });
    describe("Test update user if the id is existing and the data is valid", () => {
        it("Should update the user ", () => __awaiter(void 0, void 0, void 0, function* () {
            var userDto = new user_1.UserDto();
            userDto.id = "1";
            userDto.first_name = "oluwatobi";
            userDto.last_name = "ojo";
            var exitingUser = mapper_1.mapper.map(userDto, user_1.UserDto, user_model_1.User);
            exitingUser.created_at = new Date();
            exitingUser.updated_at = new Date();
            exitingUser.is_active = true;
            user_repository_1.userRepository.existsBy.mockResolvedValueOnce(true);
            user_repository_1.userRepository.update.mockResolvedValueOnce(exitingUser);
            user_repository_1.userRepository.findOne.mockResolvedValueOnce(exitingUser);
            var result = yield userService.updateUser(userDto);
            expect(result).not.toBeNull();
            expect(result.id).toBe(userDto.id);
            expect(result.first_name).toBe(userDto.first_name);
            expect(result.last_name).toBe(userDto.last_name);
            expect(result.created_at).toBeTruthy();
            expect(result.updated_at).toBeTruthy();
            expect(result.is_active).toBeTruthy();
        }));
    });
    describe("Test get all users if we create two users ", () => {
        it("Should get all the users ", () => __awaiter(void 0, void 0, void 0, function* () {
            var userDto = new user_1.UserDto();
            userDto.first_name = "oluwatobi";
            userDto.last_name = "ojo";
            userDto.email = "ojot630@gmail.com";
            var user = mapper_1.mapper.map(userDto, user_1.UserDto, user_model_1.User);
            user.id = "1";
            user.created_at = new Date();
            user.updated_at = new Date();
            user.is_active = true;
            user_repository_1.userRepository.save.mockResolvedValueOnce(user);
            var result = yield userService.createUser(userDto);
            expect(result).not.toBeNull();
            expect(result.id).toBeTruthy();
            expect(result.email).toBe(userDto.email);
            expect(result.first_name).toBe(userDto.first_name);
            expect(result.last_name).toBe(userDto.last_name);
            expect(result.created_at).toBeTruthy();
            expect(result.updated_at).toBeTruthy();
            expect(result.is_active).toBeTruthy();
            var userDto2 = new user_1.UserDto();
            userDto2.first_name = "oluwatobi";
            userDto2.last_name = "ojo";
            userDto2.email = "ojot631@gmail.com";
            var user2 = mapper_1.mapper.map(userDto2, user_1.UserDto, user_model_1.User);
            user2.id = "1";
            user2.created_at = new Date();
            user2.updated_at = new Date();
            user2.is_active = true;
            user_repository_1.userRepository.save.mockResolvedValueOnce(user2);
            var newResult = yield userService.createUser(userDto2);
            expect(newResult).not.toBeNull();
            expect(newResult.id).toBeTruthy();
            expect(newResult.email).toBe(userDto2.email);
            expect(newResult.first_name).toBe(userDto2.first_name);
            expect(newResult.last_name).toBe(userDto2.last_name);
            expect(newResult.created_at).toBeTruthy();
            expect(newResult.updated_at).toBeTruthy();
            expect(newResult.is_active).toBeTruthy();
            const users = [user, user2];
            user_repository_1.userRepository.find.mockResolvedValueOnce(users);
            var newUsers = yield userService.getAllUsers();
            expect(newUsers).not.toBeNull();
            expect(newUsers.length).toBe(2);
            expect(newUsers[0].id).toBe(user.id);
            expect(newUsers[0].email).toBe(user.email);
            expect(newUsers[0].first_name).toBe(user.first_name);
            expect(newUsers[1].id).toBe(user2.id);
            expect(newUsers[1].email).toBe(user2.email);
            expect(newUsers[1].first_name).toBe(user2.first_name);
            expect(newUsers[0].created_at).toBeTruthy();
            expect(newUsers[0].updated_at).toBeTruthy();
            expect(newUsers[1].created_at).toBeTruthy();
            expect(newUsers[1].updated_at).toBeTruthy();
            expect(newUsers[0].is_active).toBeTruthy();
            expect(newUsers[1].is_active).toBeTruthy();
            expect(user_repository_1.userRepository.find).toHaveBeenCalledTimes(1);
        }));
    });
    describe("Test get user by id if the id is not given ", () => {
        it("Should throw an error that id is required ", () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(userService.getUserById("")).rejects.toThrow("id is required");
        }));
    });
    describe("Test get user by id if the id is not existing ", () => {
        it("Should throw an error that user does not exist ", () => __awaiter(void 0, void 0, void 0, function* () {
            user_repository_1.userRepository.findOne.mockResolvedValueOnce(null);
            yield expect(userService.getUserById("1")).rejects.toThrow("User does not exist");
        }));
    });
    describe("Test get user by id if the id is existing ", () => {
        it("Should get the user ", () => __awaiter(void 0, void 0, void 0, function* () {
            var user = new user_model_1.User();
            user.created_at = new Date();
            user.updated_at = new Date();
            user.is_active = true;
            user.id = "1";
            user.password = "password";
            user.email = "newEMail";
            user_repository_1.userRepository.findOne.mockResolvedValueOnce(user);
            var result = yield userService.getUserById(user.id);
            expect(result.id).toBe(user.id);
            expect(result.email).toBe(user.email);
            expect(result.created_at).toBeTruthy();
            expect(result.updated_at).toBeTruthy();
            expect(result.is_active).toBeTruthy();
            expect(result.password).toBe(user.password);
            expect(user_repository_1.userRepository.findOne).toHaveBeenCalledTimes(1);
        }));
    });
    describe("Test delete user if the id is not given ", () => {
        it("Should throw an error that id is required ", () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(userService.deleteUser("")).rejects.toThrow("id is required");
        }));
    });
    describe("Test that if the id to delete the user ", () => {
        it("Should delete the user ", () => __awaiter(void 0, void 0, void 0, function* () {
            var user = new user_model_1.User();
            user.created_at = new Date();
            user.updated_at = new Date();
            user.is_active = true;
            user.id = "1";
            user.password = "password";
            user.email = "newEMail";
            user_repository_1.userRepository.findOne.mockResolvedValueOnce(user);
            yield userService.deleteUser(user.id);
            user.is_active = false;
            expect(user_repository_1.userRepository.update).toHaveBeenCalledTimes(1);
            expect(user_repository_1.userRepository.update).toHaveBeenCalledWith({ id: user.id }, { is_active: false });
        }));
    });
    describe("Test login if the request data needed for login is not given ", () => {
        it("Should throw an error that email and password is required ", () => __awaiter(void 0, void 0, void 0, function* () {
            var userDto = new user_1.UserDto();
            const responseError = {
                status: 'error',
                message: {
                    'email': 'Email is required',
                    'password': 'Password is required'
                }, statusCode: 400
            };
            yield expect(userService.login(userDto)).rejects.toThrow(JSON.stringify(responseError));
        }));
    });
    describe("Test login if the email does not exist ", () => {
        it("Should throw an error that user does not exist ", () => __awaiter(void 0, void 0, void 0, function* () {
            var userDto = new user_1.UserDto();
            userDto.email = "olakunle@gmail.com";
            userDto.password = "Password123@";
            user_repository_1.userRepository.existsBy.mockResolvedValueOnce(false);
            yield expect(userService.login(userDto)).rejects.toThrow("User does not exist");
        }));
    });
    describe("Test login if it was the first time trying to login", () => {
        it("Should send am email to that user about their otp", () => __awaiter(void 0, void 0, void 0, function* () {
            var userDto = new user_1.UserDto();
            userDto.email = "olakunle@gmail.com";
            userDto.password = "Password123@";
            var user = mapper_1.mapper.map(userDto, user_1.UserDto, user_model_1.User);
            user.is_enabled = false;
            user.is_active = true;
            user.first_name = "oluwatobi";
            user.password = (0, crypto_1.hash)("sha256", userDto.password);
            var otp = "123456";
            user_repository_1.userRepository.existsBy.mockResolvedValueOnce(true);
            user_repository_1.userRepository.findOne.mockReturnValueOnce(user);
            generateOtpService.generate.mockReturnValueOnce(otp);
            emailService.sendEmail.mockResolvedValueOnce(true);
            const response = yield userService.login(userDto);
            expect(response).toBeTruthy();
            expect(response.access_token).toBeFalsy();
            expect(response.is_enabled).toBeTruthy();
            expect(user_repository_1.userRepository.update).toHaveBeenCalledTimes(1);
            expect(user_repository_1.userRepository.update).toHaveBeenCalledWith({ id: user.id }, { is_enabled: true });
            expect(emailService.sendEmail).toHaveBeenCalledTimes(1);
            expect(generateOtpService.generate).toHaveBeenCalledTimes(1);
            expect(generateOtpService.generate).toHaveBeenCalledWith(user.id);
        }));
    });
    describe("Test login if the user is already enabled", () => {
        it("Should return a refresh token and access token", () => __awaiter(void 0, void 0, void 0, function* () {
            var userDto = new user_1.UserDto();
            userDto.email = "olakunle@gmail.com";
            userDto.password = "Password123@";
            var user = mapper_1.mapper.map(userDto, user_1.UserDto, user_model_1.User);
            user.is_enabled = true;
            user.is_active = true;
            user.first_name = "oluwatobi";
            user.password = (0, crypto_1.hash)("sha256", userDto.password);
            user_repository_1.userRepository.existsBy.mockResolvedValueOnce(true);
            user_repository_1.userRepository.findOne.mockReturnValueOnce(user);
            const response = yield userService.login(userDto);
            console.log("Response is this ", response);
            expect(response).toBeTruthy();
            expect(response.access_token).toBeTruthy();
        }));
    });
    describe("Test init login if the request data needed for init login is not given ", () => {
        it("Should throw an error that email and otp is required ", () => __awaiter(void 0, void 0, void 0, function* () {
            var userDto = new user_1.UserDto();
            const responseError = {
                status: 'error',
                message: {
                    'email': 'Email is required',
                    'otp': 'OTP is required'
                }, statusCode: 400
            };
            yield expect(userService.initLogin(userDto)).rejects.toThrow(JSON.stringify(responseError));
        }));
    });
    describe("Test init login if the email does not exist ", () => {
        it("Should throw that user does not exist ", () => __awaiter(void 0, void 0, void 0, function* () {
            var userDto = new user_1.UserDto();
            userDto.email = "wrong@gmail.com";
            userDto.otp = "120356";
            user_repository_1.userRepository.existsBy.mockResolvedValueOnce(false);
            yield expect(userService.initLogin(userDto)).rejects.toThrow(message_1.USER_DOES_NOT_EXIST);
        }));
    });
    describe("Test init login if the email is existing but the otp does not match the email ", () => {
        it("Should throw an invalid credientials ", () => __awaiter(void 0, void 0, void 0, function* () {
            var userDto = new user_1.UserDto();
            userDto.email = "correct@gmail.com";
            userDto.otp = "123456";
            user_repository_1.userRepository.existsBy.mockReturnValueOnce(true);
            var user = mapper_1.mapper.map(userDto, user_1.UserDto, user_model_1.User);
            user.id = "1098669287";
            user_repository_1.userRepository.findOne.mockReturnValueOnce(user);
            generateOtpService.verify.mockReturnValueOnce(false);
            yield expect(userService.initLogin(userDto)).rejects.toThrow(message_1.INVALID_CREDIENTIALS);
        }));
    });
    describe("Test init login if the email is valid and otp ", () => {
        it("Should return the access token ", () => __awaiter(void 0, void 0, void 0, function* () {
            var userDto = new user_1.UserDto();
            userDto.email = "correct@gmail.com";
            userDto.otp = "123456";
            user_repository_1.userRepository.existsBy.mockReturnValueOnce(true);
            var user = mapper_1.mapper.map(userDto, user_1.UserDto, user_model_1.User);
            user.id = "1098669287";
            user_repository_1.userRepository.findOne.mockReturnValueOnce(user);
            generateOtpService.verify.mockReturnValueOnce(true);
            var response = yield userService.initLogin(userDto);
            console.log("Response is this ", response);
            expect(response.access_token).toBeTruthy();
        }));
    });
});
//# sourceMappingURL=user_service.test.js.map