"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = UserRoute;
const user_controller_1 = require("../controller/user_controller");
const jwt_auth_service_1 = require("../service/jwt_auth_service");
var userRoutePath = "/api/v1/user";
var jwtService = new jwt_auth_service_1.JwtService();
function UserRoute(route) {
    route.post(userRoutePath, user_controller_1.UserController.regsiter);
    route.get(userRoutePath, [jwtService.verifyToken], user_controller_1.UserController.getUserById);
    route.patch(userRoutePath, user_controller_1.UserController.updateUser);
    route.post(userRoutePath + "/password", user_controller_1.UserController.createPassword);
}
//# sourceMappingURL=user_route.js.map