// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "../../axiosConfig";
// import classes from "../../Pages/Answer/answer.module.css";

// const QuestionDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [question, setQuestion] = useState(null);
//   const [answers, setAnswers] = useState([]);
//   const [newAnswer, setNewAnswer] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(true);

//   const [isEditing, setIsEditing] = useState(false);
//   const [editedTitle, setEditedTitle] = useState("");
//   const [editedDescription, setEditedDescription] = useState("");

//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

//   const token = localStorage.getItem("auth-token");

//   // Fetch question details
//   const fetchQuestion = async () => {
//     try {
//       const res = await axios.get(`api/question/${id}`, {
//         headers: { Authorization: "Bearer " + token },
//       });
//       setQuestion(res.data.question);
//       setEditedTitle(res.data.question.title);
//       setEditedDescription(res.data.question.content);
//     } catch (err) {
//       console.error("Error fetching question:", err);
//       setError("Failed to load question");
//     }
//   };

//   // Fetch answers
//   const fetchAnswers = async () => {
//     try {
//       const res = await axios.get(`api/answer/${id}`, {
//         headers: { Authorization: "Bearer " + token },
//       });
//       setAnswers(res.data.answers || []);
//     } catch (err) {
//       console.error("Error fetching answers:", err);
//       setAnswers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQuestion();
//     fetchAnswers();
//   }, [id]);

//   // Submit new answer
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!newAnswer.trim()) {
//       setError("Please enter your answer.");
//       setSuccess("");
//       return;
//     }

//     try {
//       await axios.post(
//         "api/answer",
//         { questionid: id, answer: newAnswer },
//         { headers: { Authorization: "Bearer " + token } }
//       );
//       setNewAnswer("");
//       setError("");
//       setSuccess("Answer submitted successfully!");
//       fetchAnswers();
//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       console.error("Error submitting answer:", err);
//       setError("Failed to submit answer");
//       setSuccess("");
//     }
//   };

//   // Edit question
//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     if (!editedTitle.trim() || !editedDescription.trim()) {
//       setError("Title and description cannot be empty.");
//       setSuccess("");
//       return;
//     }
//     try {
//       await axios.put(
//         `api/question/${id}`,
//         { title: editedTitle, description: editedDescription },
//         { headers: { Authorization: "Bearer " + token } }
//       );
//       setIsEditing(false);
//       setError("");
//       setSuccess("Question updated successfully!");
//       fetchQuestion();
//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       console.error("Error updating question:", err);
//       setError("Failed to update question");
//       setSuccess("");
//     }
//   };

//   // Delete question handlers
//   const handleDeleteClick = () => {
//     setShowDeleteConfirm(true);
//   };

//   const handleConfirmDelete = async () => {
//     try {
//       await axios.delete(`api/question/${id}`, {
//         headers: { Authorization: "Bearer " + token },
//       });
//       setError("");
//       setSuccess("Question deleted successfully!");
//       setShowDeleteConfirm(false);
//       setTimeout(() => navigate("/home"), 2000);
//     } catch (err) {
//       console.error("Error deleting question:", err);
//       setError("Failed to delete question");
//       setShowDeleteConfirm(false);
//     }
//   };

//   const handleCancelDelete = () => {
//     setShowDeleteConfirm(false);
//   };

//   if (loading) return <div className="text-center py-4">Loading...</div>;

//   return (
//     <div className="container py-4">
//       {error && <p className={classes.error}>{error}</p>}
//       {success && <p className={classes.success}>{success}</p>}

//       {question && (
//         <>
//           {/* Question Display */}
//           {!isEditing ? (
//             <>
//               <h2 className="mb-2">{question.title}</h2>
//               <p>{question.content}</p>
//               <p className="text-muted">Asked by: {question.user_id}</p>
//               <div className="mb-3">
//                 <button
//                   className="btn btn-outline-primary me-2 rounded px-4"
//                   onClick={() => setIsEditing(true)}
//                 >
//                   Edit Question
//                 </button>
//                 <button
//                   className="btn btn-outline-danger rounded px-4"
//                   onClick={handleDeleteClick}
//                 >
//                   Delete Question
//                 </button>

//                 {showDeleteConfirm && (
//                   <div className="mt-2">
//                     <span>Are you sure?</span>
//                     <button
//                       className="btn btn-danger ms-2 px-3"
//                       onClick={handleConfirmDelete}
//                     >
//                       Yes
//                     </button>
//                     <button
//                       className="btn btn-secondary ms-2 px-3"
//                       onClick={handleCancelDelete}
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 )}
//               </div>
//               <hr />
//             </>
//           ) : (
//             <form onSubmit={handleEditSubmit}>
//               <h4>Edit Question</h4>
//               <input
//                 type="text"
//                 className={`form-control mb-2 ${error ? classes.inputError : ""}`}
//                 value={editedTitle}
//                 onChange={(e) => setEditedTitle(e.target.value)}
//                 placeholder="Title"
//               />
//               <textarea
//                 className={`form-control mb-2 ${error ? classes.inputError : ""}`}
//                 rows="4"
//                 value={editedDescription}
//                 onChange={(e) => setEditedDescription(e.target.value)}
//                 placeholder="Description"
//               ></textarea>
//               <div className="mb-3">
//                 <button className="btn btn-success me-2 rounded px-4" type="submit">
//                   Save Changes
//                 </button>
//                 <button
//                   className="btn btn-secondary rounded px-4"
//                   type="button"
//                   onClick={() => setIsEditing(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="btn btn-outline-danger rounded px-4 ms-2"
//                   type="button"
//                   onClick={handleDeleteClick}
//                 >
//                   Delete Question
//                 </button>
//               </div>
//               <hr />
//             </form>
//           )}
//         </>
//       )}

//       {/* Answers Section */}
//       <div className="mt-4">
//         <h4>Answers</h4>
//         {answers.length === 0 ? (
//           <p className={classes.noAnswers}>No answers yet. Be the first to answer!</p>
//         ) : (
//           answers.map((answer, index) => (
//             <div key={index} className={classes.answerItem}>
//               <div className={classes.answerHeader}>
//                 <span className={classes.answerAuthor}>
//                   {answer.user_name || "Anonymous"}
//                 </span>
//                 <span className={classes.answerDate}>
//                   {new Date().toLocaleDateString()}
//                 </span>
//               </div>
//               <p className={classes.answerText}>{answer.content}</p>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Add New Answer */}
//       <div className="mt-4">
//         <h5>Your Answer</h5>
//         <form onSubmit={handleSubmit}>
//           <textarea
//             className={`form-control mb-3 ${error ? classes.inputError : ""}`}
//             rows="4"
//             value={newAnswer}
//             onChange={(e) => setNewAnswer(e.target.value)}
//             placeholder="Write your answer..."
//           ></textarea>
//           <button className="btn btn-warning rounded px-4" type="submit">
//             Post Answer
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default QuestionDetail;





import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import { UserContext } from "../../component/Dataprovider/DataProvider";
import classes from "../../Pages/Answer/answer.module.css";

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData] = useContext(UserContext);
  const user = userData?.user;

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Answer editing states - optimized with single state object
  const [answerStates, setAnswerStates] = useState({
    editingId: null,
    editedContent: "",
    deleteConfirmId: null,
    loading: {}
  });

  const token = localStorage.getItem("auth-token");

  // Fetch question details
  const fetchQuestion = async () => {
    try {
      const res = await axios.get(`api/question/${id}`, {
        headers: { Authorization: "Bearer " + token },
      });
      setQuestion(res.data.question);
      setEditedTitle(res.data.question.title);
      setEditedDescription(res.data.question.content);
    } catch (err) {
      console.error("Error fetching question:", err);
      setError("Failed to load question");
    }
  };

  // Fetch answers
  const fetchAnswers = async () => {
    try {
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

  useEffect(() => {
    fetchQuestion();
    fetchAnswers();
  }, [id]);

  // Submit new answer
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) {
      setError("Please enter your answer.");
      setSuccess("");
      return;
    }

    try {
      await axios.post(
        "api/answer",
        { questionid: id, answer: newAnswer },
        { headers: { Authorization: "Bearer " + token } }
      );
      setNewAnswer("");
      setError("");
      setSuccess("Answer submitted successfully!");
      fetchAnswers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error submitting answer:", err);
      setError("Failed to submit answer");
      setSuccess("");
    }
  };

  // Edit question
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editedTitle.trim() || !editedDescription.trim()) {
      setError("Title and description cannot be empty.");
      setSuccess("");
      return;
    }
    try {
      await axios.put(
        `api/question/${id}`,
        { title: editedTitle, description: editedDescription },
        { headers: { Authorization: "Bearer " + token } }
      );
      setIsEditing(false);
      setError("");
      setSuccess("Question updated successfully!");
      fetchQuestion();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating question:", err);
      setError("Failed to update question");
      setSuccess("");
    }
  };

  // Delete question handlers
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`api/question/${id}`, {
        headers: { Authorization: "Bearer " + token },
      });
      setError("");
      setSuccess("Question deleted successfully!");
      setShowDeleteConfirm(false);
      setTimeout(() => navigate("/home"), 2000);
    } catch (err) {
      console.error("Error deleting question:", err);
      setError("Failed to delete question");
      setShowDeleteConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // Optimized answer edit handlers
  const handleEditAnswer = (answerId, currentContent) => {
    setAnswerStates(prev => ({
      ...prev,
      editingId: answerId,
      editedContent: currentContent
    }));
  };

  const handleSaveAnswer = async (answerId) => {
    if (!answerStates.editedContent.trim()) {
      setError("Answer content cannot be empty.");
      return;
    }

    // Set loading state
    setAnswerStates(prev => ({
      ...prev,
      loading: { ...prev.loading, [answerId]: true }
    }));

    try {
      await axios.put(
        `api/answer/${answerId}`,
        { answer: answerStates.editedContent },
        { headers: { Authorization: "Bearer " + token } }
      );
      
      // Update answers efficiently
      setAnswers((prev) => 
        prev.map((a) => 
          a.answer_id === answerId ? { ...a, content: answerStates.editedContent } : a
        )
      );
      
      // Reset states
      setAnswerStates({
        editingId: null,
        editedContent: "",
        deleteConfirmId: null,
        loading: {}
      });
      
      setError("");
      setSuccess("Answer updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating answer:", err);
      setError("Failed to update answer");
    } finally {
      // Clear loading state
      setAnswerStates(prev => ({
        ...prev,
        loading: { ...prev.loading, [answerId]: false }
      }));
    }
  };

  const handleCancelEdit = () => {
    setAnswerStates(prev => ({
      ...prev,
      editingId: null,
      editedContent: ""
    }));
  };

  // Optimized answer delete handlers
  const handleDeleteAnswerClick = (answerId) => {
    setAnswerStates(prev => ({
      ...prev,
      deleteConfirmId: answerId
    }));
  };

  const handleConfirmDeleteAnswer = async (answerId) => {
    // Set loading state
    setAnswerStates(prev => ({
      ...prev,
      loading: { ...prev.loading, [answerId]: true }
    }));

    try {
      await axios.delete(`api/answer/${answerId}`, {
        headers: { Authorization: "Bearer " + token },
      });
      
      setAnswers((prev) => prev.filter((a) => a.answer_id !== answerId));
      
      setAnswerStates(prev => ({
        ...prev,
        deleteConfirmId: null,
        loading: { ...prev.loading, [answerId]: false }
      }));
      
      setSuccess("Answer deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error deleting answer:", err);
      setError("Failed to delete answer");
      setAnswerStates(prev => ({
        ...prev,
        deleteConfirmId: null,
        loading: { ...prev.loading, [answerId]: false }
      }));
    }
  };

  const handleCancelDeleteAnswer = () => {
    setAnswerStates(prev => ({
      ...prev,
      deleteConfirmId: null
    }));
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="container py-4">
      {error && <p className={classes.error}>{error}</p>}
      {success && <p className={classes.success}>{success}</p>}

      {question && (
        <>
          {/* Question Display */}
          {!isEditing ? (
            <>
              <h2 className="mb-2">{question.title}</h2>
              <p>{question.content}</p>
              <p className="text-muted">Asked by: {question.user_id}</p>
              <div className="mb-3">
                <button
                  className="btn btn-outline-primary me-2 rounded px-4"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Question
                </button>
                <button
                  className="btn btn-outline-danger rounded px-4"
                  onClick={handleDeleteClick}
                >
                  Delete Question
                </button>

                {showDeleteConfirm && (
                  <div className="mt-2">
                    <span>Are you sure?</span>
                    <button
                      className="btn btn-danger ms-2 px-3"
                      onClick={handleConfirmDelete}
                    >
                      Yes
                    </button>
                    <button
                      className="btn btn-secondary ms-2 px-3"
                      onClick={handleCancelDelete}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              <hr />
            </>
          ) : (
            <form onSubmit={handleEditSubmit}>
              <h4>Edit Question</h4>
              <input
                type="text"
                className={`form-control mb-2 ${
                  error ? classes.inputError : ""
                }`}
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Title"
              />
              <textarea
                className={`form-control mb-2 ${
                  error ? classes.inputError : ""
                }`}
                rows="4"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Description"
              ></textarea>
              <div className="mb-3">
                <button
                  className="btn btn-success me-2 rounded px-4"
                  type="submit"
                >
                  Save Changes
                </button>
                <button
                  className="btn btn-secondary rounded px-4"
                  type="button"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-outline-danger rounded px-4 ms-2"
                  type="button"
                  onClick={handleDeleteClick}
                >
                  Delete Question
                </button>
              </div>
              <hr />
            </form>
          )}
        </>
      )}

      {/* ✅ Answers Section */}
      <div className="mt-4">
        <h4>Answers</h4>
        {answers.length === 0 ? (
          <p className={classes.noAnswers}>
            No answers yet. Be the first to answer!
          </p>
        ) : (
          answers.map((answer, index) => (
            <div key={index} className={classes.answerItem}>
              <div className={classes.answerHeader}>
                <span className={classes.answerAuthor}>
                  {answer.user_name || "Anonymous"}
                </span>
                <span className={classes.answerDate}>
                  {new Date().toLocaleDateString()}
                </span>
              </div>

              {/* Answer content - either display or edit form */}
              {answerStates.editingId === answer.answer_id ? (
                <div className="mt-2">
                  <textarea
                    className={`form-control mb-2 ${error ? classes.inputError : ""}`}
                    rows="3"
                    value={answerStates.editedContent}
                    onChange={(e) => setAnswerStates(prev => ({
                      ...prev,
                      editedContent: e.target.value
                    }))}
                    placeholder="Edit your answer..."
                    disabled={answerStates.loading[answer.answer_id]}
                  />
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    <button
                      className="btn btn-success rounded px-3"
                      onClick={() => handleSaveAnswer(answer.answer_id)}
                      disabled={answerStates.loading[answer.answer_id]}
                    >
                      {answerStates.loading[answer.answer_id] ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                    <button
                      className="btn btn-secondary rounded px-3"
                      onClick={handleCancelEdit}
                      disabled={answerStates.loading[answer.answer_id]}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
              <p className={classes.answerText}>{answer.content}</p>

                  {/* Answer action buttons - responsive layout */}
              {user && user.userid === answer.user_id && (
                <div className="mt-2">
                      <div className="d-flex flex-wrap gap-2">
                  <button
                          className="btn btn-outline-primary rounded px-3"
                          onClick={() => handleEditAnswer(answer.answer_id, answer.content)}
                          disabled={answerStates.loading[answer.answer_id]}
                  >
                          Edit Answer
                  </button>
                  <button
                    className="btn btn-outline-danger rounded px-3"
                          onClick={() => handleDeleteAnswerClick(answer.answer_id)}
                          disabled={answerStates.loading[answer.answer_id]}
                        >
                          Delete Answer
                        </button>
                      </div>

                      {/* Delete confirmation - responsive */}
                      {answerStates.deleteConfirmId === answer.answer_id && (
                        <div className="mt-2 p-2 bg-light rounded">
                          <div className="d-flex flex-wrap align-items-center gap-2">
                            <span className="text-muted">Are you sure?</span>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-danger btn-sm px-3"
                                onClick={() => handleConfirmDeleteAnswer(answer.answer_id)}
                                disabled={answerStates.loading[answer.answer_id]}
                              >
                                {answerStates.loading[answer.answer_id] ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                    Deleting...
                                  </>
                                ) : (
                                  'Yes'
                                )}
                              </button>
                              <button
                                className="btn btn-secondary btn-sm px-3"
                                onClick={handleCancelDeleteAnswer}
                                disabled={answerStates.loading[answer.answer_id]}
                              >
                                Cancel
                  </button>
                </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add New Answer */}
      <div className="mt-4">
        <h5>Your Answer</h5>
        <form onSubmit={handleSubmit}>
          <textarea
            className={`form-control mb-3 ${error ? classes.inputError : ""}`}
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
  );
};

export default QuestionDetail;
