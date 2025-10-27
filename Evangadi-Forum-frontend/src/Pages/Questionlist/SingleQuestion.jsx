import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import Layout from "../../component/Layout/Layout"; // Assuming you use Layout
import { UserContext } from "../../component/Dataprovider/DataProvider";
import classes from "../../Pages/Answer/answer.module.css"; // Using answer CSS module

const SingleQuestion = () => {
  // Renamed from QuestionDetail
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData] = useContext(UserContext);
  const user = userData?.user;
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to get token
  const getToken = () => localStorage.getItem("auth-token");

  // Fetch question details
  const fetchQuestion = async () => {
    try {
      const token = getToken();
      const res = await axios.get(`api/question/${id}`, {
        headers: { Authorization: "Bearer " + token },
      });
      // The API response for a single question usually includes all its answers
      // If your API does this, you only need to call fetchQuestion.
      // Assuming your API separates question and answers, we keep both calls for safety.
      setQuestion(res.data);
    } catch (err) {
      console.error("Error fetching question:", err);
      setError("Failed to load question");
    }
  };

  // Fetch answer data for the given question
  const fetchAnswers = async () => {
    try {
      const token = getToken();
      const res = await axios.get(`api/answer/${id}`, {
        headers: { Authorization: "Bearer " + token },
      });
      setAnswers(res.data.answers || []);
    } catch (err) {
      console.error("Error fetching answers:", err);
      setAnswers([]);
    } finally {
      setLoading(false);
    }
  };

  // Perform data fetching when component loads or ID changes
  useEffect(() => {
    fetchQuestion();
    fetchAnswers();
  }, [id]);

  // Provide a new response
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    try {
      const token = getToken();
      await axios.post(
        "api/answer",
        { questionid: id, answer: newAnswer },
        { headers: { Authorization: "Bearer " + token } }
      );
      setNewAnswer("");
      setError(null);
      // Refresh answers after posting
      fetchAnswers();
    } catch (err) {
      console.error("Error submitting answer:", err);
      setError("Failed to submit answer");
    }
  };

  // Delete answer functionality
  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm("Are you sure you want to delete this answer?")) return;
    try {
      const token = getToken();
      await axios.delete(`api/answer/${answerId}`, {
        headers: { Authorization: "Bearer " + token },
      });
      setAnswers((prev) => prev.filter((a) => a.answer_id !== answerId));
    } catch (err) {
      console.error("Error deleting answer:", err);
      setError("Failed to delete answer");
    }
  };

  if (loading)
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  if (error)
    return (
      <Layout>
        <div className="alert alert-danger">{error}</div>
      </Layout>
    );

  return (
    <Layout>
      <div className={classes.container}>
        {error && <p className={classes.error}>{error}</p>}
        {/* ========================================
        Question Section
        ========================================
      */}
        {question && (
          <div className={classes.questionSection}>
            <p className={classes.topText}>Question</p>
            <div className={classes.questionCard}>
              {/* Left Side: Profile Icon and Username */}
              <div className={classes.profileGroup}>
                <div className={classes.profileIcon}>
                  <i className="fa fa-user-circle"></i>
                </div>
                <p className={classes.usernameDisplay}>
                  {question.username || "Anonymous"}
                </p>
              </div>

              {/* Right Side: Title and Description */}
              <div className={classes.questionContent}>
                <h2 className={classes.questionTitle}>{question.title}</h2>
                <p className={classes.questionDescription}>
                  {question.description}
                </p>
              </div>
            </div>
            <hr className={classes.separator} />
          </div>
        )}

        {/* ========================================
        Answers Section
        ========================================
      */}
        <div className={classes.answersSection}>
          <h4 className={classes.answersHeader}>
            Answer From The Community ({answers.length})
          </h4>

          {answers.length === 0 ? (
            <p className={classes.noAnswers}>
              No answers yet. Be the first to reply!
            </p>
          ) : (
            answers.map((a) => (
              <div key={a.answer_id} className={classes.answerItem}>
                <div className={classes.answerHeader}>
                  <span className={classes.answerAuthor}>
                    {a.user_name || "Anonymous"}
                  </span>
                  <span className={classes.answerDate}>
                    {new Date(a.created_at || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <p className={classes.answerText}>{a.content}</p>

                {/* Edit and Delete buttons for answer owner - responsive */}
                {user && user.userid === a.user_id && (
                  <div className="mt-2">
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        className="btn btn-outline-primary rounded px-3"
                        onClick={() => navigate(`/answers/edit/${a.answer_id}`)}
                      >
                        Edit Answer
                      </button>
                      <button
                        className="btn btn-outline-danger rounded px-3"
                        onClick={() => handleDeleteAnswer(a.answer_id)}
                      >
                        Delete Answer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* ========================================
        Add New Answer Form
        ========================================
      */}
        <div className="mt-4">
          <h5>Your Answer</h5>
          <form onSubmit={handleSubmit}>
            <textarea
              className="form-control mb-3"
              rows="4"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Write your answer..."
            ></textarea>
            <button className="btn btn-warning rounded px-4" type="submit">
              Post Answer
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SingleQuestion;