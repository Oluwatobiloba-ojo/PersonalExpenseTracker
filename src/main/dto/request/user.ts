import { AutoMap } from "@automapper/classes";
import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsPhoneNumber, IsStrongPassword, Length, Matches, ValidateIf } from "class-validator";

export class UserDto {

    @AutoMap()
    @ValidateIf((o) => o.action_type === "create_password" || o.action_type === "update_user")
    @IsNotEmpty({message: "id is required"})
    id: string;

    @AutoMap()
    @ValidateIf((o) => o.action_type === "create_user")
    @IsNotEmpty({message: "First name is required"})
    first_name: string;

    @AutoMap()
    @ValidateIf((o) => o.action_type === "create_user")
    @IsNotEmpty({message: "Last name is required"})    
    last_name: string;

    @AutoMap()
    @ValidateIf((o) => o.action_type === "create_user" || o.action_type === "login" || o.action_type === "init_login")
    @IsNotEmpty({message: "Email is required"})
    @IsEmail({}, {message: "Email must be a valid email address."})
    email: string;
    
    @AutoMap()
    @IsOptional()
    @IsPhoneNumber('NG', {message: "Phone number must be a valid phone number."})
    phone_number: string;

    @AutoMap()
    created_at: Date;
    
    @AutoMap()
    updated_at: Date;
    
    @AutoMap()
    is_active: boolean;

    @AutoMap()
    @ValidateIf((o) => o.action_type === "create_password" || o.action_type === "login")
    @IsNotEmpty({message: "Password is required"})
    @IsStrongPassword({minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1},)
    password: string;

    @AutoMap()
    is_enabled: boolean;

    action_type: string;

    access_token: string;

    @ValidateIf((o) => o.action_type === "init_login")
    @IsNotEmpty({message: "OTP is required"})
    @IsNumberString({no_symbols: true}, {message: "OTP must be a valid number."})
    @Length(6, 6, {message: "OTP must be exactly 6 digits."})
    otp: string;
}



