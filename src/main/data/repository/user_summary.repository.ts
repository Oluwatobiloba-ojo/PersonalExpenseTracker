import { PostgresDataSource } from "../../config/data_source";
import { UserSummary } from "../entity/user_summary_model";

export const user_summary_repository = PostgresDataSource.getRepository(UserSummary);
