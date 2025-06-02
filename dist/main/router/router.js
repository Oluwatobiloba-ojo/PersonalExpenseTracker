"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("./auth_route");
const user_route_1 = require("./user_route");
const route = (0, express_1.Router)();
(0, auth_route_1.AuthRoute)(route);
(0, user_route_1.UserRoute)(route);
// route.post("/api")
exports.default = route;
//# sourceMappingURL=router.js.map