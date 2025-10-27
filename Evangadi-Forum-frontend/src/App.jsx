import React, { useContext, useEffect, useState, createContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { UserContext } from "./component/Dataprovider/DataProvider.jsx";
import Home from "./Pages/Home/Home.jsx";
import Login from "./Pages/Login/Login.jsx";
import axios from "./axiosConfig";
import Question from "./Pages/Question/Question.jsx";
import Register from "./Pages/Register/Register.jsx";
import QuestionDetail from "./Pages/Questionlist/QuestionDetail.jsx";
import Answer from "./Pages/Answer/Answer.jsx";
import NotFound from "./Pages/Login/Notfound.jsx";
import QuestionList from "./Pages/Questionlist/QuestionList.jsx"
import { getToken } from "./utils/tokenHelper.js";
import HowItWorks from "./Pages/Howitworks/Howitworks.jsx"
import TermsAndConditions from "./Pages/TermsAndConditions/TermsAndConditions.jsx";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword.jsx";
import PrivacyPolicy from "./Pages/PrivacyPolicy/PrivacyPolicy.jsx";
import LoadingSpinner from "./component/LoadingSpinner/LoadingSpinner.jsx";
import "./styles/responsive.css";

export const AppState = createContext();

function App() {
  const [userData, setUserData] = useContext(UserContext);
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [appLoading, setAppLoading] = useState(true);

  const checkUser2 = async () => {
    try {
      const token = getToken(); // Use the helper
      if (!token) {
        navigate("/login");
        return;
      }

      const { data } = await axios.get("api/user/checkUser");
      // No need for headers - axiosConfig handles it automatically

      setUserData({ user: data, token: token });
      setUser(data);
      console.log("User data:", data);
    } catch (error) {
      console.log("Auth check error:", error);
      if (error.response?.status === 401) {
        // Token is invalid, redirect to login
        navigate("/login");
      }
    } finally {
      setAppLoading(false);
    }
  };

  useEffect(() => {
    const token = getToken(); // Use the helper
    if (token) {
      checkUser2();
    } else {
      navigate("/login");
      setAppLoading(false);
    }
  }, []);

  // Show loading spinner while checking authentication
  if (appLoading) {
    return <LoadingSpinner fullScreen text="Loading application..." />;
  }

  return (
    <AppState.Provider value={{ user, setUser }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/question" element={<Question />} />
        <Route path="/question/:id" element={<QuestionDetail />} />
        <Route path="/answer/:id" element={<Answer />} />
        <Route path="/allquestion" element={<QuestionList />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppState.Provider>
  );
}

export default App;
