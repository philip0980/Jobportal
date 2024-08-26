import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = ({ isLoggedIn }) => {
  const [profileData, setProfileData] = useState(null);
  const [applicationData, setApplicationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buttonText, setButtonText] = useState("Approve");
  const [buttonStyle, setButtonStyle] = useState({
    backgroundColor: "green",
    cursor: "allowed",
  });

  // Function to fetch profile data
  const getData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get("http://localhost:8000/api/v1/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setProfileData(response.data.user);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setError(error.response ? error.response.data.message : error.message);
      setLoading(false);
    }
  };

  // Function to fetch application data
  const postApplication = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get(
        `http://localhost:8000/api/v1/send-request/${userId}/receive`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setApplicationData(response.data.receivedRequests);
      console.log(response.data.receivedRequests);
    } catch (error) {
      console.error("Error fetching application data:", error);
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  // Fetch profile data on component mount
  useEffect(() => {
    getData();
  }, []);

  // Fetch application data when profileData changes
  useEffect(() => {
    if (profileData && profileData._id) {
      postApplication(profileData._id);
    }
  }, [profileData]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isLoggedIn) {
    return <div>Login First</div>;
  }

  const handleApprove = () => {
    setButtonStyle({
      backgroundColor: "grey",
      cursor: "not-allowed",
    });
    setButtonText("Approved");
  };

  return (
    <div className="profile-container">
      <div className="left">
        <img
          src={profileData.avatar.url}
          width={"150px"}
          height={"150px"}
          alt="profile"
        />
        <div className="line">
          <h1>{profileData.fullname}</h1>
          <p>{profileData.email}</p>
          <hr />
        </div>
        <ul>
          <li>
            <p>Phone</p>
            <p>{profileData.phone}</p>
          </li>
          <li>
            <p>Address</p>
            <p>{profileData.address}</p>
          </li>
        </ul>
      </div>
      <div className="right">
        <div className="lower">
          <div className="applications">
            <h1>Applications</h1>
            {applicationData ? (
              applicationData.map((applicationDatas) => (
                <div className="application-item">
                  <p>
                    {applicationDatas.data.fullname} has applied for the post of{" "}
                    {applicationDatas.data.job}
                  </p>
                  <div style={{ lineHeight: "0.2rem" }}>
                    <p style={{ fontSize: "0.7rem" }}>
                      Email : {applicationDatas.data.email}
                    </p>
                    <p style={{ fontSize: "0.7rem" }}>
                      Phone : {applicationDatas.data.phone}
                    </p>
                  </div>
                  <button style={buttonStyle} onClick={handleApprove}>
                    {buttonText}
                  </button>
                </div>
              ))
            ) : (
              <p>No applications found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
