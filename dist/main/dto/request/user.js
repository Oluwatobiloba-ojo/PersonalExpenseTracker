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
exports.UserDto = void 0;
const classes_1 = require("@automapper/classes");
const class_validator_1 = require("class-validator");
class UserDto {
}
exports.UserDto = UserDto;
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.ValidateIf)((o) => o.action_type === "create_password" || o.action_type === "update_user"),
    (0, class_validator_1.IsNotEmpty)({ message: "id is required" }),
    __metadata("design:type", String)
], UserDto.prototype, "id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.ValidateIf)((o) => o.action_type === "create_user"),
    (0, class_validator_1.IsNotEmpty)({ message: "First name is required" }),
    __metadata("design:type", String)
], UserDto.prototype, "first_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.ValidateIf)((o) => o.action_type === "create_user"),
    (0, class_validator_1.IsNotEmpty)({ message: "Last name is required" }),
    __metadata("design:type", String)
], UserDto.prototype, "last_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.ValidateIf)((o) => o.action_type === "create_user" || o.action_type === "login" || o.action_type === "init_login"),
    (0, class_validator_1.IsNotEmpty)({ message: "Email is required" }),
    (0, class_validator_1.IsEmail)({}, { message: "Email must be a valid email address." }),
    __metadata("design:type", String)
], UserDto.prototype, "email", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsPhoneNumber)('NG', { message: "Phone number must be a valid phone number." }),
    __metadata("design:type", String)
], UserDto.prototype, "phone_number", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Date)
], UserDto.prototype, "created_at", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Date)
], UserDto.prototype, "updated_at", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Boolean)
], UserDto.prototype, "is_active", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.ValidateIf)((o) => o.action_type === "create_password" || o.action_type === "login"),
    (0, class_validator_1.IsNotEmpty)({ message: "Password is required" }),
    (0, class_validator_1.IsStrongPassword)({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }),
    __metadata("design:type", String)
], UserDto.prototype, "password", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Boolean)
], UserDto.prototype, "is_enabled", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.action_type === "init_login"),
    (0, class_validator_1.IsNotEmpty)({ message: "OTP is required" }),
    (0, class_validator_1.IsNumberString)({ no_symbols: true }, { message: "OTP must be a valid number." }),
    (0, class_validator_1.Length)(6, 6, { message: "OTP must be exactly 6 digits." }),
    __metadata("design:type", String)
], UserDto.prototype, "otp", void 0);
//# sourceMappingURL=user.js.map