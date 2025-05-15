import { validate, ValidationError } from "class-validator";
import { UserDto } from "../dto/request/user";
import { formatError } from "../utils/formatter";
import { AppError } from "../error/app_error";
import { mapper } from "../mapper/mapper";
import { User } from "../data/entity/user_model";
import { Repository } from "typeorm";
import { userRepository } from "../data/repository/user.repository";
import { USER_ALREADY_EXIST, USER_DOES_NOT_EXIST } from "../error/message";
import { IdentityService } from "./identity_service";
import { hash } from "crypto";

export class UserService implements IdentityService {

    private readonly users: Repository<User> = userRepository;

    async createUser(request: UserDto) : Promise<UserDto> {
        request.action_type = "create_user";

        const error : ValidationError[] = await validate(request);
        
        const isError = error.length > 0;
        
        if(isError) {const errorResponse = formatError(error); throw new AppError(JSON.stringify(errorResponse), errorResponse.statusCode);}

        if(await this.isExistingUser(request))throw new AppError(USER_ALREADY_EXIST, 400);
    
        var user: User = mapper.map(request, UserDto, User);
        user = await this.users.save(user);
        return mapper.map(user, User, UserDto);
    }

    async createPassword(request: UserDto): Promise<UserDto> {
        request.action_type = "create_password";
        
        const error : ValidationError[] = await validate(request);
        
        const isError = error.length > 0;
        
        if(isError) {const errorResponse = formatError(error); throw new AppError(JSON.stringify(errorResponse), errorResponse.statusCode);}
        
        if(!await this.isExistingUser(request))throw new AppError(USER_DOES_NOT_EXIST, 400);
        else if(await this.isPasswordExisting(request)) {throw new AppError("Password already exists", 400)};

        const hashedPassword = hash("sha256", request.password);

        await this.users.update({ id: request.id }, { password: hashedPassword });

        const updatedUser: User = await this.users.findOne({ where: { id: request.id } });

        return mapper.map(updatedUser, User, UserDto);
    }


    getUserById(id: string): Promise<UserDto> {
        throw new Error("Method not implemented.");
    }

    getAllUsers(): Promise<UserDto[]> {
        throw new Error("Method not implemented.");
    }


    updateUser(request: UserDto): Promise<UserDto> {
        throw new Error("Method not implemented.");
    }


    deleteUser(id: string): void {
        throw new Error("Method not implemented.");
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
            console.log("User in is password existing", user?.password !== null);
            return user?.password !== null;
        }else if (request.email) {
            const user = await this.users.findOneBy({ email: request.email });
            return user?.password !== null;
        }
        return false;
    }
    



    



}

