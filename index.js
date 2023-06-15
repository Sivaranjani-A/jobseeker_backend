import express from "express"; // if type : "module" new type import
import { MongoClient } from "mongodb";

import usersRouter from "./routes/users.route.js";
import jobsRouter from "./routes/jobs.route.js";

import dotenv from "dotenv";

import cors from "cors";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

//mongodb connection

const MONGO_URL = process.env.DB;

const client = new MongoClient(MONGO_URL);
await client.connect();
console.log("mongo is connected");

app.use(express.json()); // middleware for all post requests to convert json data from body into JS Object
app.use(cors());

app.use("/user", usersRouter);
app.use("/jobs", jobsRouter);

app.listen(PORT, () => console.log("server started in", PORT));

export { client };
