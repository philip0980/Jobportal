import React, { useState } from "react";
import axios from "axios";
import "./Postjob.css";
import LoginFirst from "../components/LoginFirst";

const Postjob = ({ isLoggedIn }) => {
  const [formData, setFormData] = useState({
    headline: "",
    employmentType: "",
    description: "",
    keySkills: "",
    experienceMin: "",
    experienceMax: "",
    salaryCurrency: "",
    salaryMin: "",
    salaryMax: "",
    vacancies: "",
    companyName: "",
    logo: null, // Add logo to form data state
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  if (!isLoggedIn) {
    return <LoginFirst />;
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo") {
      setFormData({
        ...formData,
        logo: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("You must be logged in to post a job.");
      return;
    }

    const jobData = new FormData();
    for (const key in formData) {
      jobData.append(key, formData[key]);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/job",
        jobData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setSuccessMessage("Job posted successfully!");
    } catch (error) {
      setErrorMessage("Failed to post job. Please try again.");
      console.error("Error posting job:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "100vw",
      }}
    >
      <div className="container">
        <h1>Post Job</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="headline">Job Posting Headline</label>
          <input
            type="text"
            name="headline"
            placeholder="Use a title that best describes the role in your company"
            value={formData.headline}
            onChange={handleChange}
            required
          />
          <label htmlFor="employmentType">Employment Type</label>
          <select
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            required
          >
            <option value="">Select Employment Type</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
          </select>

          <label htmlFor="description">Job Description</label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
          <label htmlFor="keySkills">Key Skills</label>
          <input
            type="text"
            name="keySkills"
            value={formData.keySkills}
            onChange={handleChange}
            required
          />
          <label htmlFor="experienceMin">Work Experience</label>
          <input
            type="number"
            name="experienceMin"
            placeholder="Min"
            value={formData.experienceMin}
            onChange={handleChange}
            required
          />
          <p>to</p>
          <input
            type="number"
            name="experienceMax"
            placeholder="Max"
            value={formData.experienceMax}
            onChange={handleChange}
            required
          />
          <label htmlFor="salaryCurrency">Salary Range</label>
          <select
            name="salaryCurrency"
            value={formData.salaryCurrency}
            onChange={handleChange}
            required
          >
            <option value="">Select Currency</option>
            <option value="₹">Rupees</option>
            <option value="$">Dollar</option>
          </select>
          <input
            type="number"
            name="salaryMin"
            placeholder="Min Annual Salary"
            value={formData.salaryMin}
            onChange={handleChange}
            required
          />
          <p>to</p>
          <input
            type="number"
            name="salaryMax"
            placeholder="Max Annual Salary"
            value={formData.salaryMax}
            onChange={handleChange}
            required
          />
          <label htmlFor="vacancies">No of Vacancies</label>
          <input
            type="number"
            name="vacancies"
            value={formData.vacancies}
            onChange={handleChange}
            required
          />
          <label htmlFor="companyName">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
          <label htmlFor="logo">Company Logo</label>
          <input type="file" name="logo" onChange={handleChange} required />
          <button type="submit">Submit</button>
        </form>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      </div>
    </div>
  );
};

export default Postjob;
