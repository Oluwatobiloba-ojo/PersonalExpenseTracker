"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDailySummary = void 0;
const typeorm_1 = require("typeorm");
const user_model_1 = require("./user_model");
let UserDailySummary = class UserDailySummary {
    setUpTransaction() {
        this.created_at = new Date();
    }
    updateUser() {
        this.updated_at = new Date();
    }
};
exports.UserDailySummary = UserDailySummary;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], UserDailySummary.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_model_1.User, (user) => user.id),
    __metadata("design:type", String)
], UserDailySummary.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], UserDailySummary.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], UserDailySummary.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bigint" }),
    __metadata("design:type", Number)
], UserDailySummary.prototype, "total_spending_count", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bigint" }),
    __metadata("design:type", Number)
], UserDailySummary.prototype, "total_income_count", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "json", nullable: false }),
    __metadata("design:type", Map)
], UserDailySummary.prototype, "category_total_count", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "numeric", scale: 2, precision: 10, nullable: false }),
    __metadata("design:type", Number)
], UserDailySummary.prototype, "total_spending_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "numeric", scale: 2, precision: 10, nullable: false }),
    __metadata("design:type", Number)
], UserDailySummary.prototype, "total_income_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "json", nullable: false }),
    __metadata("design:type", Map)
], UserDailySummary.prototype, "category_total_value", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserDailySummary.prototype, "setUpTransaction", null);
__decorate([
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserDailySummary.prototype, "updateUser", null);
exports.UserDailySummary = UserDailySummary = __decorate([
    (0, typeorm_1.Entity)("user_daily_summary")
], UserDailySummary);
//# sourceMappingURL=user_daily_summary_model.js.map