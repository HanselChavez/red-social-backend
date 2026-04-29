import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import { User } from "../entities/User";
import { UserProfile } from "../entities/UserProfile";
import { Post } from "../entities/Post";
import { Comment } from "../entities/Comment";
import { Reaction } from "../entities/Reaction";
import { Follow } from "../entities/Follow";

import { DataSource } from "typeorm";
import { VerificationToken } from "../entities/VerificationToket";
export const AppDataSource = new DataSource({
    type: "mssql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 1433,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    synchronize: true,
    migrations: [__dirname + "/migrations/*.ts"],
    dropSchema: false, //true
    logging: false,

    entities: [__dirname + "/entities/**/*.ts"],

    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
});

console.log("DB_HOST:", process.env.DB_HOST);
