"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoute = AuthRoute;
const auth_controller_1 = require("../controller/auth_controller");
var authRoutePath = "/api/v1/auth";
function AuthRoute(route) {
    route.post(authRoutePath + "/login", auth_controller_1.AuthController.login);
    route.post(authRoutePath + "/initLogin", auth_controller_1.AuthController.initLogin);
}
//# sourceMappingURL=auth_route.js.map