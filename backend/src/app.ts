import express from "express";
import cors from "cors";
import main from "./routes/index";
import cookieParser from "cookie-parser";

export const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", main);
