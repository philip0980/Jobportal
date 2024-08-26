import React from "react";
import Postjob from "../pages/Postjob";

const ProfileJobWrapper = ({ isLoggedIn }) => {
  return <Postjob isLoggedIn={isLoggedIn} />;
};

export default ProfileJobWrapper;
