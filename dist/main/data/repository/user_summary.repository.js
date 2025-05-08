"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_summary_repository = void 0;
const data_source_1 = require("../../config/data_source");
const user_summary_model_1 = require("../entity/user_summary_model");
exports.user_summary_repository = data_source_1.PostgresDataSource.getRepository(user_summary_model_1.UserSummary);
//# sourceMappingURL=user_summary.repository.js.map