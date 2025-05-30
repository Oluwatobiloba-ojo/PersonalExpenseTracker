import { plainToInstance } from "class-transformer";
import { UserDto } from "../dto/request/user";
import { Request, Response } from "express";
import { IdentityService } from "../service/identity_service";
import { UserService } from "../service/user_service";

export class AuthController {

    private static userService: IdentityService = new UserService();

    static login = async (req: Request, res: Response) => {
        try {
            const userDto: UserDto = plainToInstance(UserDto, req.body);
            const user = await this.userService.login(userDto);
            res.status(200).json(user);
        } catch (error) {
            res.status(error.statusCode).json({ message: error.message });
        }
    };

    static initLogin = async(req: Request, res : Response) => {
        try{
            const userDto: UserDto = plainToInstance(UserDto, req.body);
            const loginUser = await this.userService.login(userDto);
            res.status(200).json(loginUser);
        }catch(error){
            res.status(error.statusCode).json({message: error.message});
        }
    };



}