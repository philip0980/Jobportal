import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const NewPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchJobDetails(token);
    } else {
      console.error("Token not found");
    }
  }, [id]);

  const fetchJobDetails = async (token) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/job/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setJob(response.data.data);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{job.companyName}</h1>
      <h3>{job.headline}</h3>
      <p>{job.description}</p>
      <p>{job.keySkills}</p>
      <ul>
        <li>{job.employmentType}</li>
        <li>
          {job.experienceMin} - {job.experienceMax} years
        </li>
        <li>
          {job.salaryCurrency}
          {job.salaryMin} - {job.salaryMax}
        </li>
      </ul>
    </div>
  );
};

export default NewPage;
