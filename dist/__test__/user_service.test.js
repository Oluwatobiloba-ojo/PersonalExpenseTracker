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
require("reflect-metadata");
jest.mock("../main/data/repository/user.repository");
describe("User service: ", () => {
    let userService;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        (0, user_mapper_1.createUserMappings)();
        userService = new user_service_1.UserService();
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
});
//# sourceMappingURL=user_service.test.js.map