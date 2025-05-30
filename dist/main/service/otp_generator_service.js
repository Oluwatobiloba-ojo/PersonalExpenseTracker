"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpGeneratorService = void 0;
const otp_model_1 = require("../data/entity/otp_model");
const otp_repository_1 = require("../data/repository/otp_repository");
const otp_generator = __importStar(require("otp-generator"));
const app_error_1 = require("../error/app_error");
class otpGeneratorService {
    constructor() {
        this.otps = otp_repository_1.otp_repository;
    }
    generate(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            var otp = new otp_model_1.OtpModel();
            otp.user_id = user_id;
            otp.otp = otp_generator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false, });
            otp.created_at = new Date();
            var savedOtp = yield this.otps.save(otp);
            console.log("Saved otp is this ", savedOtp);
            return savedOtp.otp;
        });
    }
    verify(user_id, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            var foundOtp = yield this.otps.findOne({ where: { user_id: user_id } });
            if (!foundOtp) {
                throw new app_error_1.AppError("OTP not found for the given user ID.", 400);
            }
            if (foundOtp.otp !== otp) {
                return false;
            }
            return true;
        });
    }
}
exports.otpGeneratorService = otpGeneratorService;
//# sourceMappingURL=otp_generator_service.js.map