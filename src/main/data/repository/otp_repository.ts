import { PostgresDataSource } from "../../config/data_source";
import { OtpModel } from "../entity/otp_model";

export const otp_repository = PostgresDataSource.getRepository(OtpModel);
