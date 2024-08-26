import mongoose, { Types } from "mongoose";

const jobSchema = new mongoose.Schema(
  [
    {
      headline: {
        type: String,
        required: true,
      },
      employmentType: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      keySkills: {
        type: String,
        required: true,
      },
      experienceMin: {
        type: Number,
        required: true,
      },
      experienceMax: {
        type: Number,
        required: true,
      },
      salaryCurrency: {
        type: String,
        required: true,
      },
      salaryMin: {
        type: Number,
        required: true,
      },
      salaryMax: {
        type: Number,
        required: true,
      },
      vacancies: {
        type: Number,
        required: true,
      },
      companyName: {
        type: String,
        required: true,
      },

      logo: {
        public_id: String,
        url: String,
      },

      user: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  ],
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
