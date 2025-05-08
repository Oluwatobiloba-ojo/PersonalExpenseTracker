"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transaction_repository = void 0;
const data_source_1 = require("../../config/data_source");
const transaction_model_1 = require("../entity/transaction_model");
exports.transaction_repository = data_source_1.PostgresDataSource.getRepository(transaction_model_1.Transaction);
//# sourceMappingURL=transaction_repository.js.map