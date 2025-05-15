"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserMappings = createUserMappings;
const core_1 = require("@automapper/core");
const user_model_1 = require("../data/entity/user_model");
const user_1 = require("../dto/request/user");
const mapper_1 = require("./mapper");
function createUserMappings() {
    (0, core_1.createMap)(mapper_1.mapper, user_model_1.User, user_1.UserDto);
    (0, core_1.createMap)(mapper_1.mapper, user_1.UserDto, user_model_1.User);
}
//# sourceMappingURL=user_mapper.js.map