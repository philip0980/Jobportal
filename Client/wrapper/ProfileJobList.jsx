import React from "react";
import Joblist from "../pages/Joblist";

const ProfileJobList = ({ isLoggedIn }) => {
  return <Joblist isLoggedIn={isLoggedIn} />;
};

export default ProfileJobList;
