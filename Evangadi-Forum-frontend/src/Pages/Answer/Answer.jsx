import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../../axiosConfig";
import Layout from "../../component/Layout/Layout";
import { UserContext } from "../../component/Dataprovider/DataProvider";
import classes from "./answer.module.css";

function Answer() {
  const { question_id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("auth-token");

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await axios.get(`api/answer/${question_id}`, {
          headers: { Authorization: "Bearer " + token },
        });
        setAnswers(response.data.answers || []);
      } catch (err) {
        console.error("Error fetching answers:", err);
        setError("Failed to load answers.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnswers();
  }, [question_id, token]);

  const handleDelete = async (answerId) => {
    try {
      await axios.delete(`api/answer/${answerId}`, {
        headers: { Authorization: "Bearer " + token },
      });
      setAnswers((prev) => prev.filter((a) => a.answer_id !== answerId));
    } catch (err) {
      console.error("Error deleting answer:", err);
      alert(err.response?.data?.message || "Failed to delete answer.");
    }
  };

  const handleEdit = (answerId) => {
    navigate(`/answers/edit/${answerId}`);
  };

  if (loading) return <Layout><p className={classes.loading}>Loading answers...</p></Layout>;
  if (error) return <Layout><p className={classes.error}>{error}</p></Layout>;

  return (
    <Layout>
      <div className={classes.container}>
        <div className={classes.answersSection}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>All Answers</h3>
            <Link to={`/answers/new/${question_id}`} className={classes.submitButton}>
              + Add Answer
            </Link>
          </div>

          {answers.length === 0 ? (
            <p className={classes.noAnswers}>No answers yet. Be the first to answer!</p>
          ) : (
            answers.map((ans) => (
              <div key={ans.answer_id} className={classes.answerItem}>
                <div className={classes.answerHeader}>
                  <span className={classes.answerAuthor}>{ans.user_name || "Anonymous"}</span>
                  <span className={classes.answerDate}>
                    {new Date(ans.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className={classes.answerText}>{ans.content}</p>

                {/* Buttons visible to all logged-in users */}
                {user && (
                  <div className={classes.actionButtons}>
                    <button
                      className={classes.editButton}
                      onClick={() => handleEdit(ans.answer_id)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className={classes.deleteButton}
                      onClick={() => handleDelete(ans.answer_id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Answer;
