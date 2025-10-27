import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { UserContext } from "../../context/UserContext";
import classes from "./answer.module.css";

const AnswerQuestion = ({ questionId }) => {
  const [userData] = useContext(UserContext);
  const [form, setForm] = useState({ answer: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData?.user?.id) {
      setError("Please log in to post an answer.");
      setSuccess("");
      navigate("/login");
      return;
    }

    if (!form.answer.trim()) {
      setError("Please enter your answer before submitting.");
      setSuccess("");
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/answer`,
        {
          id: userData.user.id,
          questionId,
          answer: form.answer,
        },
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );

      setForm({ answer: "" });
      setError("");
      setSuccess("Your answer was posted successfully!");

      // Auto-clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Problem posting answer:", err);
      setError("Something went wrong. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className={classes.container}>
      <form onSubmit={handleSubmit} className={classes.answerForm}>
        <h3 className={classes.formTitle}>Answer The Top Question</h3>

        <Link to="/" className={classes.backLink}>
          Go to Question Page
        </Link>

        {error && <p className={classes.error}>{error}</p>}
        {success && <p className={classes.success}>{success}</p>}

        <textarea
          onChange={handleChange}
          value={form.answer}
          className={`${classes.answerInput} ${error ? classes.inputError : ""}`}
          placeholder="Your Answer..."
          name="answer"
        />

        <button className={classes.answerButton} type="submit">
          Post Your Answer
        </button>
      </form>
    </div>
  );
};

export default AnswerQuestion;



