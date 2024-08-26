import React, { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import NewPage from "../pages/NewPage";
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const ProfileWrapper = lazy(() => import("../wrapper/ProfileWrapper"));
const ProfileJobWrapper = lazy(() => import("../wrapper/ProfileJobWrapper"));
const ProfileJobList = lazy(() => import("../wrapper/ProfileJobList"));
const CompaniesWrapper = lazy(() => import("../wrapper/CompaniesWrapper"));
import "./App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };
  return (
    <Router>
      <div>
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" Component={Home} />
            <Route path="/login" Component={Login} onLogin={handleLogin} />
            <Route path="/register" Component={Register} />
            <Route
              path="/jobs"
              element={<ProfileJobList isLoggedIn={isLoggedIn} />}
            />
            <Route path="/job/:id" element={<NewPage />} />
            <Route
              path="/companies"
              element={<CompaniesWrapper isLoggedIn={isLoggedIn} />}
            />
            <Route
              path="/postjob"
              element={<ProfileJobWrapper isLoggedIn={isLoggedIn} />}
            />
            <Route
              path="/profile"
              element={<ProfileWrapper isLoggedIn={isLoggedIn} />}
            />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
