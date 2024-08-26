import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Joblist.css";
import LoginFirst from "../components/LoginFirst";

const Joblist = ({ isLoggedIn }) => {
  const [getData, setGetData] = useState([]);
  const [query, setQuery] = useState("");
  console.log(getData);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchJobs(token);
    } else {
      console.error("Token not found");
    }
  }, []);

  const navigate = useNavigate();

  const fetchJobs = async (token) => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/job", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGetData(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleApply = async (jobId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/send-request/${jobId}/user`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Application sent successfully!");
      console.log(response);
    } catch (error) {
      console.error("Error sending request:", error.response);
      alert(
        `Failed to send application: ${
          error.response.data.message || error.message
        }`
      );
    }
  };

  if (!isLoggedIn) {
    return <LoginFirst />;
  }

  const handleCardClick = (id) => {
    console.log(`Clicked on card by user with id ${id}`);
    navigate(`/job/${id}`);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          placeholder="Search for a job...."
          style={{
            padding: "1rem 0.4rem",
            width: "18rem",
            marginTop: "2rem",
          }}
        />
      </div>
      <div className="jobs">
        {getData
          .filter((data) =>
            data.headline.toLowerCase().includes(query.toLowerCase())
          )
          .map((data) => (
            <div
              key={data._id}
              className="card"
              onClick={() => handleCardClick(data._id)}
            >
              <div style={{ display: "flex", gap: "30px" }}>
                <h1>{data.companyName}</h1>
                <img src={data.logo.url} alt="logo" height={80} width={80} />
              </div>
              <h3>{data.headline}</h3>
              <p>{data.description}</p>
              <p>Skills : {data.keySkills}</p>
              <ul>
                <li>{data.employmentType}</li>
                <li>
                  {data.experienceMin} - {data.experienceMax} years
                </li>
                <li>
                  {data.salaryCurrency}
                  {data.salaryMin} - {data.salaryMax}
                </li>
              </ul>
              <button onClick={() => handleApply(data._id)}>Apply</button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Joblist;
