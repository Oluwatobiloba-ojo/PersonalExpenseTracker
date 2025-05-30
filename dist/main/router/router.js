"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("./auth_route");
const route = (0, express_1.Router)();
(0, auth_route_1.AuthRoute)(route);
exports.default = route;
//# sourceMappingURL=router.js.map