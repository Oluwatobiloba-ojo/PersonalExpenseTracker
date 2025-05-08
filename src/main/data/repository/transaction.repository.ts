import { PostgresDataSource } from "../../config/data_source";
import { Transaction } from "../entity/transaction_model";

export const transaction_repository = PostgresDataSource.getRepository(Transaction);