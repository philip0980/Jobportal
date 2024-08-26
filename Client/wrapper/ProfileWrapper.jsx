import React from "react";
import Profile from "../pages/Profile";

const ProfileWrapper = ({ isLoggedIn }) => {
  return <Profile isLoggedIn={isLoggedIn} />;
};

export default ProfileWrapper;
