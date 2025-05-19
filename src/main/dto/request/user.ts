import { AutoMap } from "@automapper/classes";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsStrongPassword, Matches, ValidateIf } from "class-validator";

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
    @ValidateIf((o) => o.action_type === "create_user")
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
    @ValidateIf((o) => o.action_type === "create_password")
    @IsNotEmpty({message: "Password is required"})
    @IsStrongPassword({minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1},)
    password: string;

    action_type: string;
}



