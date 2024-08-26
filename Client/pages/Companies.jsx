import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Companies.module.css";
import LoginFirst from "../components/LoginFirst";

const Companies = ({ isLoggedIn }) => {
  const [datas, setDatas] = useState([]);
  const [error, setError] = useState("");

  const getData = async (token) => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/job", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDatas(response.data); // Access the data property from the response
    } catch (error) {
      setError("Failed to fetch data. Please try again later.");
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getData(token);
    } else {
      console.log("Token not found");
    }
  }, []);

  if (!isLoggedIn) {
    return <LoginFirst />;
  }

  return (
    <div className={styles.container}>
      <h1>Companies</h1>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {datas.length === 0 && !error ? (
        <p className={styles.noData}>No job postings available.</p>
      ) : (
        <div className={styles.companyList}>
          {datas.map((job) => (
            <div className={styles.companyCard} key={job._id}>
              {job.logo && job.logo.url ? (
                <img
                  src={job.logo.url}
                  alt="logo"
                  height="100px"
                  width="100px"
                />
              ) : (
                <p className={styles.noLogo}>No logo available</p>
              )}
              <h4>{job.companyName}</h4>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Companies;
