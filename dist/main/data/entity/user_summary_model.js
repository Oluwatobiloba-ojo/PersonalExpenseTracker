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
exports.UserSummary = void 0;
const typeorm_1 = require("typeorm");
const user_model_1 = require("./user_model");
let UserSummary = class UserSummary {
    setUpTransaction() {
        this.created_at = new Date();
    }
    updateUser() {
        this.updated_at = new Date();
    }
};
exports.UserSummary = UserSummary;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], UserSummary.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_model_1.User, (user) => user.id),
    __metadata("design:type", String)
], UserSummary.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp with time zone" }),
    __metadata("design:type", Date)
], UserSummary.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp with time zone" }),
    __metadata("design:type", Date)
], UserSummary.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bigint" }),
    __metadata("design:type", Number)
], UserSummary.prototype, "total_spending_count", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bigint" }),
    __metadata("design:type", Number)
], UserSummary.prototype, "total_income_count", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "json", nullable: false }),
    __metadata("design:type", Map)
], UserSummary.prototype, "category_total_count", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "numeric", scale: 2, precision: 10, nullable: false }),
    __metadata("design:type", Number)
], UserSummary.prototype, "total_spending_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "numeric", scale: 2, precision: 10, nullable: false }),
    __metadata("design:type", Number)
], UserSummary.prototype, "total_income_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "json", nullable: false }),
    __metadata("design:type", Map)
], UserSummary.prototype, "category_total_value", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserSummary.prototype, "setUpTransaction", null);
__decorate([
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserSummary.prototype, "updateUser", null);
exports.UserSummary = UserSummary = __decorate([
    (0, typeorm_1.Entity)("user_summary")
], UserSummary);
//# sourceMappingURL=user_summary_model.js.map