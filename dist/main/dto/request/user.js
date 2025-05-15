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
    __metadata("design:type", String)
], UserDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "First name is required" }),
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], UserDto.prototype, "first_name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Last name is required" }),
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], UserDto.prototype, "last_name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Email is required" }),
    (0, class_validator_1.IsEmail)({}, { message: "Email must be a valid email address." }),
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], UserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\+?\d{7,15}$/, { message: 'Phone number must be 7–15 digits and may start with +.', }),
    (0, classes_1.AutoMap)(),
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
//# sourceMappingURL=user.js.map