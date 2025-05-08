"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const data_source_1 = require("../../config/data_source");
const user_model_1 = require("../entity/user_model");
exports.userRepository = data_source_1.PostgresDataSource.getRepository(user_model_1.User);
//# sourceMappingURL=user.repository.js.map