import { AutoMap } from "@automapper/classes";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsStrongPassword, Matches, ValidateIf } from "class-validator";

export class UserDto {

    @AutoMap()
    @ValidateIf((o) => o.action_type === "create_password")
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
    @IsPhoneNumber(null, {message: "Phone number must be a valid phone number."})
    // @Matches(/^\+?\d{7,15}$/, 
    //     {message: 'Phone number must be 7–15 digits and may start with +.',})
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


