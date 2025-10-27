

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import classes from "./questionlist.module.css";

const ITEMS_PER_PAGE = 5;

const QuestionList = ({ token: tokenProp, questions: questionsProp }) => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const localToken = localStorage.getItem("token") || tokenProp;

        if (!localToken) {
          console.warn("No token found — skipping fetch.");
          setLoading(false);
          return;
        }

        const res = await axios.get("/api/question", {
          headers: { Authorization: `Bearer ${localToken}` },
        });

        if (res.data.questions && Array.isArray(res.data.questions)) {
          setQuestions(res.data.questions);
          setError("");
        } else {
          setError("No questions found.");
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions.");
      } finally {
        setLoading(false);
      }
    };

    // ✅ 1️⃣ Use parent questions if available
    if (Array.isArray(questionsProp) && questionsProp.length > 0) {
      setQuestions(questionsProp);
      setLoading(false);
    }
    // ✅ 2️⃣ Otherwise, fetch from backend when token becomes available
    else if (tokenProp || localStorage.getItem("token")) {
      fetchQuestions();
    }
  }, [tokenProp, questionsProp]);

  const handleQuestionClick = (id) => {
    navigate(`/question/${id}`);
  };

  const totalPages = Math.ceil(questions.length / ITEMS_PER_PAGE);
  const paginatedQuestions = questions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className={classes.container}>
      <h1 className={classes.questionListTitle}>All Questions</h1>

      {loading ? (
        <p>Loading questions...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : questions.length === 0 ? (
        <p>No questions found.</p>
      ) : (
        <>
          <table className={classes.questionTable}>
            <thead>
              <tr>
                <th>Profile</th>
                <th>Username</th>
                <th>Question Title</th>
              </tr>
            </thead>
            <tbody>
              {paginatedQuestions.map((q) => (
                <tr
                  key={q.question_id}
                  className={classes.questionRow}
                  onClick={() => handleQuestionClick(q.question_id)}
                >
                  <td data-label="Profile" className={classes.profileIcon}>
                    {q.user_name?.charAt(0)?.toUpperCase()}
                  </td>
                  <td data-label="Username">{q.user_name}</td>
                  <td data-label="Question Title">{q.title}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={classes.pagination}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default QuestionList;


