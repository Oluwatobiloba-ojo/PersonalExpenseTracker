
import { Router } from "express";
import { AuthRoute } from "./auth_route";

const route = Router();

AuthRoute(route);


export default route;