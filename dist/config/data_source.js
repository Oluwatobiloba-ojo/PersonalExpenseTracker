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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresDataSource = void 0;
exports.default = initializeDataSource;
const typeorm_1 = require("typeorm");
const configuration_1 = __importDefault(require("./configuration"));
exports.PostgresDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: configuration_1.default.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: configuration_1.default.DB_USERNAME,
    password: configuration_1.default.DB_PASSWORD,
    database: configuration_1.default.DB_NAME,
    synchronize: true,
    logging: false,
    entities: ["src/main/data/entity/*.ts"],
    migrations: [],
    subscribers: [],
});
function initializeDataSource() {
    return __awaiter(this, void 0, void 0, function* () {
        exports.PostgresDataSource.initialize()
            .then(() => {
            console.log("Data Source has been initialized!");
        }).catch((err) => {
            console.error("Error during Data Source initialization", err);
        });
    });
}
//# sourceMappingURL=data_source.js.map