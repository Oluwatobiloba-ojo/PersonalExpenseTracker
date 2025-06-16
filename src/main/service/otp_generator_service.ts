import { Repository } from "typeorm/repository/Repository";
import { OtpModel } from "../data/entity/otp_model";
import { otp_repository } from "../data/repository/otp_repository";
import { OtpService } from "./otp_service";
import * as otp_generator from "otp-generator";
import { AppError } from "../error/app_error";

export class otpGeneratorService implements OtpService {
    
    private readonly otps: Repository<OtpModel> = otp_repository;
    
    async generate(user_id: string): Promise<string> {
        
        var otp: OtpModel = new OtpModel();
        otp.user = { id: user_id } as any;
        otp.otp = otp_generator.generate(6, {upperCaseAlphabets: false,lowerCaseAlphabets: false,specialChars: false,});
        otp.created_at = new Date();
        var savedOtp: OtpModel = await this.otps.save(otp);
        console.log("Saved otp is this ", savedOtp);
        return savedOtp.otp;
    }


    async verify(user_id: string, otp: string): Promise<boolean> {
        var foundOtp = await this.otps.findOne({ where: {user:
            {id: user_id}}});
        console.log("Founding otp ", foundOtp);
        if (!foundOtp) {
            throw new AppError("OTP not found for the given user ID.", 400);
        }
        console.log("Found otp is this ", foundOtp);
        if (foundOtp.otp !== otp) {return false;}
        return true;
    }
    

}

