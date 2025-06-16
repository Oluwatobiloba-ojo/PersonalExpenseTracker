import { Router } from "express";
import {UserController} from "../controller/user_controller"
import { AuthService } from "../service/auth_service";
import { JwtService } from "../service/jwt_auth_service";

var userRoutePath: string = "/api/v1/user";
var jwtService: AuthService = new JwtService();

export function UserRoute(route: Router){

    route.post(userRoutePath, UserController.regsiter);
    route.get(userRoutePath, [ jwtService.verifyToken ], UserController.getUserById);
    route.patch(userRoutePath, UserController.updateUser);
    route.post(userRoutePath+"/password", UserController.createPassword);

}