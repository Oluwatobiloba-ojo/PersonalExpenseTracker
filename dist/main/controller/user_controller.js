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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_1 = require("../dto/request/user");
const class_transformer_1 = require("class-transformer");
const user_service_1 = require("../service/user_service");
const formatter_1 = require("../utils/formatter");
class UserController {
}
exports.UserController = UserController;
_a = UserController;
UserController.userService = new user_service_1.UserService();
UserController.regsiter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDto = (0, class_transformer_1.plainToInstance)(user_1.UserDto, req.body);
        const user = yield _a.userService.createUser(userDto);
        res.status(201).json(user);
    }
    catch (error) {
        console.log("ERROR IS THIS ", error);
        res.status(error.statusCode).json((0, formatter_1.formatErrorResponse)(error));
    }
});
UserController.createPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDto = (0, class_transformer_1.plainToInstance)(user_1.UserDto, req.body);
        const user = yield _a.userService.createPassword(userDto);
        res.status(200).json(user);
    }
    catch (error) {
        res.status(error.statusCode).json((0, formatter_1.formatErrorResponse)(error));
    }
});
UserController.updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDto = (0, class_transformer_1.plainToInstance)(user_1.UserDto, req.body);
        const updatedUser = yield _a.userService.updateUser(userDto);
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
UserController.getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield _a.userService.getUserById(userId);
        res.status(200).json(user);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
//# sourceMappingURL=user_controller.js.map