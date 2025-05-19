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

export class UserService implements IdentityService {

    private readonly users: Repository<User> = userRepository;

    async createUser(request: UserDto) : Promise<UserDto> {
        request.action_type = "create_user";

        const error : ValidationError[] = await validate(request);
        
        const isError = error.length > 0;
        
        if(isError) {const errorResponse = formatError(error); 
            throw new AppError(JSON.stringify(errorResponse), errorResponse.statusCode);}

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
        else if(await this.isPasswordExisting(request)) {throw new AppError(PASSWORD_ALREADY_EXIST, 400)};

        const hashedPassword = hash("sha256", request.password);

        await this.users.update({ id: request.id }, { password: hashedPassword });

        const updatedUser: User = await this.users.findOne({ where: { id: request.id } });

        return mapper.map(updatedUser, User, UserDto);
    }

    async updateUser(request: UserDto): Promise<UserDto> {
        request.action_type = "update_user";
        const error : ValidationError[] = await validate(request);
        const isError = error.length > 0;
        
        if (isError) {const errorResponse = formatError(error); 
            throw new AppError(JSON.stringify(errorResponse), errorResponse.statusCode);}
        
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

