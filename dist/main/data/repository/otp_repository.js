"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otp_repository = void 0;
const data_source_1 = require("../../config/data_source");
const otp_model_1 = require("../entity/otp_model");
exports.otp_repository = data_source_1.PostgresDataSource.getRepository(otp_model_1.OtpModel);
//# sourceMappingURL=otp_repository.js.map