
import { Router } from "express";
import { AuthRoute } from "./auth_route";
import { UserRoute } from "./user_route";
import { READONLY } from "sqlite3";

const route = Router();

AuthRoute(route);
UserRoute(route);

// route.post("/api")

export default route;