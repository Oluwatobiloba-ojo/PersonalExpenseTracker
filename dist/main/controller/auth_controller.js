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
exports.AuthController = void 0;
const class_transformer_1 = require("class-transformer");
const user_1 = require("../dto/request/user");
const user_service_1 = require("../service/user_service");
class AuthController {
}
exports.AuthController = AuthController;
_a = AuthController;
AuthController.userService = new user_service_1.UserService();
AuthController.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDto = (0, class_transformer_1.plainToInstance)(user_1.UserDto, req.body);
        const user = yield _a.userService.login(userDto);
        res.status(200).json(user);
    }
    catch (error) {
        res.status(error.statusCode).json(error.message);
    }
});
AuthController.initLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDto = (0, class_transformer_1.plainToInstance)(user_1.UserDto, req.body);
        const loginUser = yield _a.userService.initLogin(userDto);
        res.status(200).json(loginUser);
    }
    catch (error) {
        res.status(error.statusCode).json({ message: error.message });
    }
});
//# sourceMappingURL=auth_controller.js.map