import React, { useContext, useEffect, useState, useCallback } from "react";
import Layout from "../../component/Layout/Layout";
import classes from "./home.module.css";
import { Link, useNavigate } from "react-router-dom";
import QuestionList from "../Questionlist/QuestionList";
import { UserContext } from "../../component/Dataprovider/DataProvider";
import axios from "../../axiosConfig"; // Import axios
import LoadingSpinner from "../../component/LoadingSpinner/LoadingSpinner";

function Home() {
  const [userData, setUserData] = useContext(UserContext); // Get setUserData if available for context update
  const navigate = useNavigate();
  const isLoggedIn = !!userData.user;

  // State to hold fetched data and manage request status
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  // 1. Authentication Check and Redirect
  useEffect(() => {
    // Allow navigation if user exists or a token exists (post-login before checkUser completes)
    const hasToken = !!(userData?.token || localStorage.getItem("token"));
    if (!isLoggedIn && !hasToken) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate, userData]);

  // 2. Fetch Questions (use token if required by backend)
  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const res = await axios.get("/api/question", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      // Assuming res.data contains { questions: [...] }
      if (res.data.questions && Array.isArray(res.data.questions)) {
        setAllQuestions(res.data.questions);
      } else {
        setAllQuestions([]);
        setError("Invalid response format from server.");
      }
    } catch (err) {

      // Handle errors (e.g., 500 server error, network failure)
      setError("Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [navigate, setUserData]);

  useEffect(() => {
    // Only attempt to fetch questions if the user is logged in
    if (isLoggedIn) {
      fetchQuestions();
    }
  }, [isLoggedIn, fetchQuestions]);

  // 3. Search and Filtering Logic
  const handleSearchInputChange = (e) => setSearchQuery(e.target.value);

  // The list shown is either the filtered list or the full list
  const questionsToShow = allQuestions.filter((question) =>
    question.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading)
    return (
      <Layout>
        <div className={classes.container}>
          <LoadingSpinner text="Loading questions..." />
        </div>
      </Layout>
    );
  // if an error occurred after loading
  if (error)
    return (
      <Layout>
        <div className={classes.container}>
          <div className="alert alert-danger text-center">
            {error}
          </div>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className={classes.container}>
        {/* Welcome + Ask Button + Search Section */}
        <div className={classes.userActions}>
          {/* ... (Welcome text, Ask Button container, and Search Box remain the same) */}
          <span className={classes.welcomeText}>
            Welcome:{" "}
            <span className={classes.username}>
              {userData.user?.display_name || userData.user?.user_name || userData.user?.username || "Guest"}
            </span>
          </span>

          <div className={classes.askButtonContainer}>
            <Link to="/question">
              <button className={classes.askButton}>Ask Question</button>
            </Link>
          </div>

          <div className={classes.searchBox}>
            <input
              type="text"
              placeholder="search question"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            {/* Keeping the handleSearch function out as per previous steps */}
          </div>
        </div>

        {/* Question List */}
        <div className={classes.questionsSection}>
          {questionsToShow.length === 0 && searchQuery ? (
            <p className={classes.emptyMessage}>
              No results found for "{searchQuery}".
            </p>
          ) : (
            <QuestionList questions={questionsToShow} />
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Home;