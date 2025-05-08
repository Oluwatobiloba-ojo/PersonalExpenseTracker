import { PostgresDataSource } from "../../config/data_source";
import { User } from "../entity/user_model";

export const userRepository = PostgresDataSource.getRepository(User);

