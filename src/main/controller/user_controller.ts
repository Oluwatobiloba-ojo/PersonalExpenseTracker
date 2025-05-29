import { Request, Response } from "express";
import { UserDto } from "../dto/request/user";
import { plainToInstance } from "class-transformer";
import { IdentityService } from "../service/identity_service";
import { UserService } from "../service/user_service";

export class UserController {

    private static userService: IdentityService = new UserService();

    static regsiter = async (req: Request, res: Response) => {        
        try {
            const userDto: UserDto = plainToInstance(UserDto, req.body);
            const user = await this.userService.createUser(userDto);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static createPassword = async (req: Request, res: Response) => { 
        try {
            const userDto: UserDto = plainToInstance(UserDto, req.body);
            const user = await this.userService.createPassword(userDto);
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static updateUser = async (req: Request, res: Response) => {
        try {
            const userDto: UserDto = plainToInstance(UserDto, req.body);
            const updatedUser = await this.userService.updateUser(userDto);
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static getUserById = async (req: Request, res: Response) => {
        try {
            const userId = req.params.id;
            const user = await this.userService.getUserById(userId);
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

}
