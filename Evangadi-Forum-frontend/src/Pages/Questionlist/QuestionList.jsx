
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import classes from "./questionlist.module.css";

const ITEMS_PER_PAGE = 5;

const QuestionList = ({ questions: questionsProp = [] }) => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState(questionsProp);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");

  // Sync with prop when Home passes filtered questions
  useEffect(() => {
    if (Array.isArray(questionsProp) && questionsProp.length > 0) {
      setQuestions(questionsProp);
      setCurrentPage(1);
    }
  }, [questionsProp]);

  // Fetch questions if not provided via props
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/question", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (res.data?.questions) {
          setQuestions(res.data.questions);
        } else {
          setQuestions([]);
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions. Please refresh the page.");
      }
    };

    if (!questionsProp || questionsProp.length === 0) {
      fetchQuestions();
    }
  }, [questionsProp]);

  // Pagination logic
  const totalPages = Math.ceil(questions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentQuestions = questions.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div className={classes.container}>
      <table className={classes.questionTable}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>User</th>
            <th>User ID</th>
          </tr>
        </thead>
        <tbody>
          {currentQuestions.length > 0 ? (
            currentQuestions.map((q) => (
              <tr
                key={q.question_id}
                className={classes.questionRow}
                onClick={() => navigate(`/question/${q.question_id}`)}
              >
                <td data-label="Title">{q.title}</td>
                <td data-label="Description">
                  {q.content?.length > 80
                    ? q.content.slice(0, 80) + "..."
                    : q.content}
                </td>
                <td data-label="User">
                  <div className={classes.profileIcon}>
                    {q.user_name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  &nbsp;{q.user_name || "Unknown"}
                </td>
                <td data-label="User ID">{q.user_id}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No questions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={classes.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionList;




