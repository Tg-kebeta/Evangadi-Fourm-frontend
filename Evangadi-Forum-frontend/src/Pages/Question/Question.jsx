import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../component/Dataprovider/DataProvider.jsx";
import axios from "../../axiosConfig";
import { useNavigate } from "react-router-dom";
import Layout from "../../component/Layout/Layout";
import classes from "./question.module.css";

function Question() {
  const navigate = useNavigate();
  const [userData] = useContext(UserContext);
  const titleDom = useRef();
  const descriptionDom = useRef();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!userData.user) navigate("/login");
  }, [userData.user, navigate]);

  const token = localStorage.getItem("token");

  async function handleSubmit(e) {
    e.preventDefault();
    const titleValue = titleDom.current.value.trim();
    const descriptionValue = descriptionDom.current.value.trim();

    if (!titleValue || !descriptionValue) {
      setError("Please provide all required information.");
      setSuccess("");
      return;
    }

    try {
      await axios.post(
        "api/question",
        {
          title: titleValue,
          description: descriptionValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setError("");
      setSuccess("Thank you for your question!");
      titleDom.current.value = "";
      descriptionDom.current.value = "";

      // Redirect after 2 seconds
      setTimeout(() => navigate("/home"), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong!");
      setSuccess("");
    }
  }

  return (
    <Layout>
      <div className={classes.question_container}>
        <div className={classes.question_wrapper}>
          <h3 className={classes.question_headtitle}>
            Steps to write a good Question
          </h3>
          <ul className={classes.question_li}>
            <li>Summarize your problems in a one-line title.</li>
            <li>Describe your problem in more detail.</li>
            <li>Explain what you have tried and what you expected to happen.</li>
            <li>Review your question and post it to the site.</li>
          </ul>
          <h4>Ask a public question</h4>
          <div className={classes.question_headtitle2}>
            {error && <p className={classes.error}>{error}</p>}
            {success && <p className={classes.success}>{success}</p>}
            <form onSubmit={handleSubmit}>
              <input
                className={`${classes.question_title} ${error ? classes.inputError : ""}`}
                ref={titleDom}
                type="text"
                placeholder="Title"
              />
              <textarea
                rows={4}
                className={`${classes.question_description} ${error ? classes.inputError : ""}`}
                ref={descriptionDom}
                placeholder="Question Description..."
              />
              <span>
                <button
                  className={classes.question_button}
                  variant="primary"
                  type="submit"
                >
                  Post Your Question
                </button>
              </span>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Question;
