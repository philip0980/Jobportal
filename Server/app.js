import express, { urlencoded } from "express";
import dotenv from "dotenv";
import { Database } from "./config/db_connection.js";
import userRoute from "./routes/user.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import cloudinary from "cloudinary";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
const app = express();

dotenv.config();
Database();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(
//   fileUpload({
//     limits: { fileSize: 50 * 1024 * 1024 },
//     useTempFiles: true,
//   })
// );

app.use("/api/v1", userRoute);

app.get("/", (req, res) => {
  res.send("Hello world");
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});
