
import { DataSource } from "typeorm";
import config from "./configuration";

export const PostgresDataSource  : DataSource = new DataSource({
    type: "postgres",
    host: config.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    synchronize: true,
    logging: false,
    entities: ["src/main/data/entity/*.ts"],
    migrations: [],
    subscribers: [],
})


export default async function initializeDataSource() {
    PostgresDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    }).catch((err) => {
        console.error("Error during Data Source initialization", err)
    });
}


