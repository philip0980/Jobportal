import React from "react";
import job from "../public/jobs.png";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="container">
      <div className="ls">
        <h1 style={{ textDecoration: "none" }}>
          Hire the <span className="orange">Right Talent</span>
          with <br />
          <span className="orange">Right Skills</span>
        </h1>
        <h3>Over 50M+ Qualified Candidates</h3>
        <div className="buttons">
          <Link to="/postjob">
            <button>Post a Job</button>
          </Link>
        </div>
      </div>
      <div className="image">
        <img src={job} alt="job" />
      </div>
    </div>
  );
};

export default Home;
