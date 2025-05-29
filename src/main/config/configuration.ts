import * as dotenv from 'dotenv';

dotenv.config();



export const config = {
    PORT: process.env.PORT,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASS: process.env.MAIL_PASS,
    OWNER_EMAIL: process.env.OWNER_EMAIL,
    JWT_SECRET: process.env.JWT_SECRET,
    EXPIRATION_SECONDS: process.env.EXPIRATION_SECONDS,
}

export default config;