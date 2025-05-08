import { PostgresDataSource } from "../../config/data_source";
import { UserDailySummary } from "../entity/user_daily_summary_model";

export const user_daily_summary_repository = PostgresDataSource.getRepository(UserDailySummary);

