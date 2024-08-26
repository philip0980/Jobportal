import express from "express";
import multer from "multer";
import {
  Login,
  Register,
  Jobs,
  Logout,
  getJobs,
  getProfile,
  sendRequest,
  receiveRequest,
  fetchJobDetails,
} from "../controllers/user.js";
import { isAuthenticated } from "../middleware/auth.js";
const app = express.Router();

const upload = multer({ dest: "/tmp" });

app.post("/register", upload.single("avatar"), Register);
app.post("/login", Login);
app.post("/logout", Logout);
app.post("/job", isAuthenticated, upload.single("logo"), Jobs);
app.get("/job", isAuthenticated, getJobs);
app.get("/job/:id", isAuthenticated, fetchJobDetails);
app.get("/profile", isAuthenticated, getProfile);
app.post("/send-request/:jobId/user", isAuthenticated, sendRequest);
app.post("/send-request/:userId/receive", receiveRequest);
app.get("/send-request/:userId/receive", receiveRequest);

export default app;
