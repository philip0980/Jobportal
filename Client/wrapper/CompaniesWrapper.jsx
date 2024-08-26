import React from "react";
import Companies from "../pages/Companies";

const CompaniesWrapper = ({ isLoggedIn }) => {
  return <Companies isLoggedIn={isLoggedIn} />;
};

export default CompaniesWrapper;
