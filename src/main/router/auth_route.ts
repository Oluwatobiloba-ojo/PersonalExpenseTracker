import { Router } from "express";
import { AuthController } from "../controller/auth_controller";

var authRoutePath: string = "/api/v1/auth";

export function AuthRoute(route: Router){

    route.post(authRoutePath+"/login", AuthController.login);
    route.post(authRoutePath+"/initLogin", AuthController.initLogin);

}