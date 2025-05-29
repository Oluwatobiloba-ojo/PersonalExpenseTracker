import { validate, ValidationError } from "class-validator";
import { UserDto } from "../dto/request/user";
import { formatError } from "../utils/formatter";
import { AppError } from "../error/app_error";
import { mapper } from "../mapper/mapper";
import { User } from "../data/entity/user_model";
import { Repository } from "typeorm";
import { userRepository } from "../data/repository/user.repository";
import { ID_REQUIRED, PASSWORD_ALREADY_EXIST, USER_ALREADY_EXIST, USER_DOES_NOT_EXIST } from "../error/message";
import { IdentityService } from "./identity_service";
import { hash } from "crypto";
import { OtpService } from "./otp_service";
import { otpGeneratorService } from "./otp_generator_service";
import { EmailService } from "./email_service";
import { NodeMailerService } from "./node_mailer_service";
import { AuthService } from "./auth_service";
import { JwtService } from "./jwt_auth_service";

export class UserService implements IdentityService {

    private users: Repository<User> = userRepository;
    private otpService: OtpService = new otpGeneratorService();
    private emailService: EmailService = new NodeMailerService();
    private auth_service: AuthService = new JwtService();

    async createUser(request: UserDto) : Promise<UserDto> {
        request.action_type = "create_user";

        await this.validateRequest(request);

        if(await this.isExistingUser(request))throw new AppError(USER_ALREADY_EXIST, 400);
    
        var user: User = mapper.map(request, UserDto, User);
        user = await this.users.save(user);
        return mapper.map(user, User, UserDto);
    }

    async createPassword(request: UserDto): Promise<UserDto> {
        request.action_type = "create_password";
        
        await this.validateRequest(request);
    
        if(!await this.isExistingUser(request))throw new AppError(USER_DOES_NOT_EXIST, 400);
        else if(await this.isPasswordExisting(request)) {throw new AppError(PASSWORD_ALREADY_EXIST, 400)};

        await this.users.update({ id: request.id }, { password: hash("sha256", request.password) });

        return mapper.map(await this.users.findOne({ where: { id: request.id } }), User, UserDto);
    }

    async updateUser(request: UserDto): Promise<UserDto> {
        request.action_type = "update_user";
        await this.validateRequest(request);
        
        if(! await this.isExistingUser(request)) throw new AppError(USER_DOES_NOT_EXIST, 400);

        await this.users.update({id: request.id}, {first_name: request.first_name, last_name: request.last_name, phone_number: request.phone_number});
        
        const updatedUser: User = await this.users.findOne({ where: { id: request.id } });

        return mapper.map(updatedUser, User, UserDto);
    }

    async getUserById(id: string): Promise<UserDto> {
        if(!id) {throw new AppError(ID_REQUIRED, 400)}

        const foundUser: User = await this.users.findOne({ where: { id: id } });

        if(!foundUser) throw new AppError(USER_DOES_NOT_EXIST, 400);
        
        return mapper.map(foundUser, User, UserDto);
    }

    async getAllUsers(): Promise<UserDto[]> {
        const users: User[] = await this.users.find({ where: { is_active: true } })

        return users.map(user => mapper.map(user, User, UserDto));
    }


    async deleteUser(id: string): Promise<void> {
        if(!id) {throw new AppError(ID_REQUIRED, 400)}
        var foundUser = await this.users.findOne({ where: { id: id } });
        if(!foundUser) return;
        if(foundUser.is_active){
            await this.users.update({ id: id }, { is_active: false });
            return;
        }

    }

    
    async login(request: UserDto): Promise<UserDto> {
        request.action_type = "login";
        await this.validateRequest(request);
        
        if(!await this.isExistingUser(request)) throw new AppError(USER_DOES_NOT_EXIST, 400);
        
        var user = await this.users.findOne({ where: { email: request.email } });

        var passwordIsNotMatch: boolean = user?.password !== hash("sha256", request.password);
        if(passwordIsNotMatch) {throw new AppError("Invalid credentials", 401);}
        
        if(!user.is_enabled)    {return await this.initLogin(user);
        }else   {return await this.accessToken(user);} 
    }


    


    
    
    private async accessToken(user: User) {
        var token = await this.auth_service.generateToken(user.id);
        console.log("Token is this ", token);
        var userDto: UserDto = mapper.map(user, User, UserDto);
        userDto.access_token = token;
        return userDto;
    }

    private async initLogin(user: User) {
        var otp: string = await this.otpService.generate(user.id);
        console.log("Otp is this ", otp);
        var message = `<h1>Please confirm your email </h1>
                        <p> here is your OTP code:-> ${otp} </p>`;
        await this.emailService.sendEmail(user.email, "Your OTP Code", message);
        user.is_enabled = true;
        await this.users.update({ id: user.id }, { is_enabled: true });
        return mapper.map(user, User, UserDto);
    }

    private async validateRequest(request: UserDto) {
        const error: ValidationError[] = await validate(request);
        const isError = error.length > 0;
        if (isError) {
            const errorResponse = formatError(error);
            throw new AppError(JSON.stringify(errorResponse), errorResponse.statusCode);
        }
    }

    private async isExistingUser(request: UserDto): Promise<boolean> {
        if (request.id) {
            return await this.users.existsBy({  id: request.id } );
        }else if (request.email) {
            return await this.users.existsBy({ email: request.email } );
        }
        return false;
    }

    private async isPasswordExisting(request: UserDto) {
        if (request.id) {
            const user = await this.users.findOneBy({id: request.id } );
            return user?.password !== null;
        }else if (request.email) {
            const user = await this.users.findOneBy({ email: request.email });
            return user?.password !== null;
        }
        return false;
    }
}



