import express, { Request, Response } from "express";
import receiptsRouter from "./models/receipts/model";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const PORT = process.env.PORT;

// ---- Middleware ----

// Parse JSON bodies
app.use(express.json());

// ---- Routes ----

// Health check
app.get("/ping", (request: Request, response: Response) => {
    response.status(200).send("pong");
});

// Root routes
app.use("/receipts", receiptsRouter);

// ---- Server ----

const server = app.listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
}).on("error", (error) => {
    throw new Error(error.message);
});

export {
    app,
    server
};
