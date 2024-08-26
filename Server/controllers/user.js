import User from "../models/user.js";
import Job from "../models/job.js";
import Request from "../models/request.js";
import { sendToken } from "../utils/sendToken.js";
import mongoose from "mongoose";
import cloudinary from "cloudinary";
import multer from "multer";
const { ObjectId } = mongoose.Types;
import fs from "fs";

const Register = async (req, res) => {
  const { fullname, email, phone, password, address } = req.body;
  const avatar = req.file?.path;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    let myCloud;
    if (avatar) {
      myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
      });

      fs.unlinkSync(avatar);
    }

    const newUser = await User.create({
      avatar: myCloud
        ? {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          }
        : undefined,
      fullname,
      phone,
      address,
      email,
      password,
    });

    await newUser.save();

    sendToken(res, newUser, 200, "User Created");
  } catch (error) {
    if (!res.headersSent) {
      res.status(400).send(error);
    }
    console.log(error);
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.password !== password) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    sendToken(res, user, 200, "Login Successful");
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

const Logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

const Jobs = async (req, res) => {
  const {
    headline,
    employmentType,
    description,
    keySkills,
    experienceMin,
    experienceMax,
    salaryCurrency,
    salaryMin,
    salaryMax,
    vacancies,
    companyName,
  } = req.body;
  const logo = req.file?.path;

  if (!logo) {
    return res
      .status(400)
      .json({ success: false, message: "Logo is required" });
  }

  try {
    const myCloud = await cloudinary.v2.uploader.upload(logo, {
      folder: "logo",
    });

    fs.rmSync(logo);

    const job = await Job.create({
      headline,
      employmentType,
      description,
      keySkills,
      experienceMin,
      experienceMax,
      salaryCurrency,
      salaryMin,
      salaryMax,
      vacancies,
      companyName,
      user: req.user._id,
      logo: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });

    // Save the job document
    await job.save();

    return res
      .status(200)
      .json({ success: true, message: "Job Created Successfully" });
  } catch (error) {
    console.error(error);

    // Ensure temporary file is removed in case of an error
    if (logo && fs.existsSync(logo)) {
      fs.rmSync(logo);
    }

    return res.status(500).json({ success: false, message: error.message });
  }
};

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.send(jobs);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

const sendRequest = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    // console.log(user);
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId).exec();
    // console.log(job);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const postJobUser = job.user;
    const data = {
      fullname: user.fullname,
      phone: user.phone,
      address: user.address,
      email: user.email,
      job: job.headline,
    };

    const newRequest = await Request.create({
      sender: user._id,
      receiver: postJobUser,
      data: data,
      status: "pending",
    });

    await newRequest.save();

    // const URL = `http://localhost:8000/api/v1/send-request/${postJobUser}/receive`;
    // await axios.post(URL, data);

    res.status(200).json({
      success: true,
      message: "Data sent successfully",
      data,
      newRequest,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
    console.log(error.message);
  }
};

const receiveRequest = async (req, res) => {
  const userId = req.params.userId;

  try {
    if (!ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }

    const receivedRequests = await Request.find({ receiver: userId }).exec();

    if (receivedRequests.length === 0) {
      console.log(`Received request not found for user ${userId}`);
      return res
        .status(404)
        .json({ success: false, message: "Received request not found" });
    }

    const matchingRequests = receivedRequests.filter(
      (request) => request.receiver.toString() === userId
    );

    if (matchingRequests.length === 0) {
      console.log(`Receiver not found for user ${userId}`);
      return res
        .status(403)
        .json({ success: false, message: "Receiver not found" });
    }

    console.log(`Received data for user ${userId}:`, matchingRequests);
    return res.status(200).json({
      success: true,
      message: "Data received successfully",
      receivedRequests: matchingRequests,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const fetchJobDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Job.findById(id);
    // console.log(data);
    return res.status(200).json({
      success: true,
      message: "Data received successfully",
      data: data,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  Login,
  Register,
  Jobs,
  Logout,
  getJobs,
  getProfile,
  sendRequest,
  receiveRequest,
  fetchJobDetails,
};
