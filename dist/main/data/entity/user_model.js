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
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const classes_1 = require("@automapper/classes");
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
let User = User_1 = class User {
    setUpUser() {
        const user = (0, class_transformer_1.plainToInstance)(User_1, this);
        this.created_at = new Date();
        this.updated_at = new Date();
        this.is_active = true;
        Object.assign(this, user);
    }
    updateUser() {
        const user = (0, class_transformer_1.plainToInstance)(User_1, this);
        this.updated_at = new Date();
        Object.assign(this, user);
    }
};
exports.User = User;
__decorate([
    (0, classes_1.AutoMap)(),
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    (0, class_transformer_1.Transform)(({ value }) => value.toString().trim()),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, typeorm_1.Column)({ type: "varchar", length: 100, nullable: false }),
    (0, class_transformer_1.Transform)(({ value }) => value.toString().trim()),
    __metadata("design:type", String)
], User.prototype, "first_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, typeorm_1.Column)({ type: "varchar", length: 100, nullable: false }),
    (0, class_transformer_1.Transform)(({ value }) => value.toString().trim()),
    __metadata("design:type", String)
], User.prototype, "last_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, typeorm_1.Column)({ type: "varchar", length: 100, unique: true, nullable: false }),
    (0, class_transformer_1.Transform)(({ value }) => value.toString().trim()),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, typeorm_1.Column)({ type: "varchar", length: 5000, nullable: true }),
    (0, class_transformer_1.Transform)(({ value }) => value.toString().trim()),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, typeorm_1.Column)({ type: "varchar", length: 11, nullable: true }),
    (0, class_transformer_1.Transform)(({ value }) => value.toString().trim()),
    __metadata("design:type", String)
], User.prototype, "phone_number", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, typeorm_1.Column)({ type: "timestamp with time zone" }),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, typeorm_1.Column)({ type: "timestamp with time zone" }),
    __metadata("design:type", Date)
], User.prototype, "updated_at", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], User.prototype, "setUpUser", null);
__decorate([
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], User.prototype, "updateUser", null);
exports.User = User = User_1 = __decorate([
    (0, typeorm_1.Entity)("users")
], User);
//# sourceMappingURL=user_model.js.map