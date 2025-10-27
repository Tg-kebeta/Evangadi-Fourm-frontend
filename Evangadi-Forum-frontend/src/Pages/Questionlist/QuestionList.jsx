// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "../../axiosConfig";
// import classes from "./questionlist.module.css";

// const ITEMS_PER_PAGE = 5;

// const QuestionList = ({ token: tokenProp, questions: questionsProp }) => {
//   const [questions, setQuestions] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [token, setToken] = useState(
//     tokenProp || localStorage.getItem("token")
//   );
//   const [currentPage, setCurrentPage] = useState(1);

//   const navigate = useNavigate();

//   // 🔁 Keep token in sync with localStorage and tokenProp
//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken && storedToken !== token) {
//       setToken(storedToken);
//     }
//   }, [tokenProp]);

//   // 📡 Listen for global token updates
//   useEffect(() => {
//     const handleTokenUpdate = () => {
//       const newToken = localStorage.getItem("token");
//       setToken(newToken);
//     };

//     window.addEventListener("token-updated", handleTokenUpdate);

//     return () => {
//       window.removeEventListener("token-updated", handleTokenUpdate);
//     };
//   }, []);

//   // 📥 Fetch Questions
//   useEffect(() => {
//     const fetchQuestions = async () => {
//       if (!token) return; // wait until token is available

//       try {
//         setLoading(true);
//         const res = await axios.get("/api/question", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (Array.isArray(res.data.questions)) {
//           setQuestions(res.data.questions);
//           setError("");
//         } else {
//           setError("No questions found.");
//         }
//       } catch (err) {
//         console.error("Error fetching questions:", err);
//         setError("Failed to load questions.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (Array.isArray(questionsProp) && questionsProp.length > 0) {
//       setQuestions(questionsProp);
//       setLoading(false);
//     } else {
//       fetchQuestions();
//     }
//   }, [token, questionsProp]);

//   const handleQuestionClick = (id) => {
//     navigate(`/question/${id}`);
//   };

//   const totalPages = Math.ceil(questions.length / ITEMS_PER_PAGE);
//   const paginatedQuestions = questions.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );

//   return (
//     <div className={classes.container}>
//       <h1 className={classes.questionListTitle}>All Questions</h1>

//       {loading ? (
//         <p>Loading questions...</p>
//       ) : error ? (
//         <p style={{ color: "red" }}>{error}</p>
//       ) : questions.length === 0 ? (
//         <p>No questions found.</p>
//       ) : (
//         <>
//           <table className={classes.questionTable}>
//             <thead>
//               <tr>
//                 <th>Profile</th>
//                 <th>Username</th>
//                 <th>Question Title</th>
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedQuestions.map((q) => (
//                 <tr
//                   key={q.question_id}
//                   className={classes.questionRow}
//                   onClick={() => handleQuestionClick(q.question_id)}
//                 >
//                   <td data-label="Profile" className={classes.profileIcon}>
//                     {q.user_name?.charAt(0)?.toUpperCase()}
//                   </td>
//                   <td data-label="Username">{q.user_name}</td>
//                   <td data-label="Question Title">{q.title}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <div className={classes.pagination}>
//             <button
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage((prev) => prev - 1)}
//             >
//               Prev
//             </button>
//             <span>
//               Page {currentPage} of {totalPages}
//             </span>
//             <button
//               disabled={currentPage === totalPages}
//               onClick={() => setCurrentPage((prev) => prev + 1)}
//             >
//               Next
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default QuestionList;


// // import React from "react";
// // import { Link } from "react-router-dom";

// // const QuestionList = ({ questions = [] }) => {
// //   if (!Array.isArray(questions)) return <p>Invalid question data</p>;

// //   if (questions.length === 0) return <p>No questions yet.</p>;

// //   return (
// //     <div>
// //       {questions.map((q) => (
// //         <div key={q?.questionid} className="border p-3 mb-3 rounded">
// //           <h5>{q?.title || "No title"}</h5>
// //           <p>{q?.description || "No description"}</p>
// //           <small className="text-muted">
// //             Asked by {q?.username || "Unknown"}
// //           </small>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // export default QuestionList;
// import React, { useEffect, useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "../../axiosConfig";
// import { UserContext } from "../../component/Dataprovider/DataProvider.jsx";
// import classes from "./questionlist.module.css";

// const ITEMS_PER_PAGE = 5;

// const QuestionList = () => {
//   const navigate = useNavigate();
//   const [userData] = useContext(UserContext);
//   const [questions, setQuestions] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ✅ Fetch questions only when token is ready
//   const fetchQuestions = async (token) => {
//     try {
//       setLoading(true);
//       const res = await axios.get("/api/question", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setQuestions(res.data.questions || []);
//       setError("");
//     } catch (err) {
//       console.error("Error fetching questions:", err);
//       setError(err.response?.data?.message || "Failed to load questions.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ React when token becomes available
//   useEffect(() => {
//     const token = userData?.token || localStorage.getItem("token");
//     if (token) {
//       fetchQuestions(token);
//     }
//   }, [userData]);

//   const totalPages = Math.ceil(questions.length / ITEMS_PER_PAGE);
//   const displayedQuestions = questions.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );

//   return (
//     <div className={classes.questionListContainer}>
//       <h2 className={classes.title}>Recent Questions</h2>

//       {loading && <p className={classes.loading}>Loading questions...</p>}
//       {error && <p className={classes.error}>{error}</p>}

//       {!loading && !error && displayedQuestions.length === 0 && (
//         <p className={classes.noQuestions}>No questions available.</p>
//       )}

//       <ul className={classes.questionList}>
//         {displayedQuestions.map((q) => (
//           <li
//             key={q._id}
//             className={classes.questionItem}
//             onClick={() => navigate(`/question/${q._id}`)}
//           >
//             <h3 className={classes.questionTitle}>{q.title}</h3>
//             <p className={classes.questionDescription}>
//               {q.description?.slice(0, 100)}...
//             </p>
//             <p className={classes.questionMeta}>
//               Asked by: <strong>{q.user?.firstname || "Anonymous"}</strong>
//             </p>
//           </li>
//         ))}
//       </ul>

//       {totalPages > 1 && (
//         <div className={classes.pagination}>
//           <button
//             onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//             disabled={currentPage === 1}
//           >
//             Prev
//           </button>
//           <span>
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuestionList;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "../../axiosConfig";
// import classes from "./questionlist.module.css";

// const ITEMS_PER_PAGE = 5;

// const QuestionList = ({ questions: questionsProp = [] }) => {
//   const navigate = useNavigate();
//   const [questions, setQuestions] = useState(questionsProp);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [error, setError] = useState(null);

//   // Keep list in sync when coming from Home (search/filter)
//   useEffect(() => {
//     if (Array.isArray(questionsProp) && questionsProp.length > 0) {
//       setQuestions(questionsProp);
//       setCurrentPage(1);
//     }
//   }, [questionsProp]);

//   // Fetch questions if not passed via props
//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get("/api/question", {
//           headers: token ? { Authorization: `Bearer ${token}` } : {},
//         });

//         if (res.data?.questions) {
//           setQuestions(res.data.questions);
//         } else {
//           setQuestions([]);
//         }
//       } catch (err) {
//         console.error("Error fetching questions:", err);
//         setError("Unable to load questions. Please refresh.");
//       }
//     };

//     if (!questionsProp || questionsProp.length === 0) {
//       fetchQuestions();
//     }
//   }, [questionsProp]);

//   // Pagination logic
//   const totalPages = Math.ceil(questions.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const currentQuestions = questions.slice(
//     startIndex,
//     startIndex + ITEMS_PER_PAGE
//   );

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) setCurrentPage(page);
//   };

//   if (error)
//     return <div className="alert alert-danger text-center">{error}</div>;

//   return (
//     <div className={classes.questionListContainer}>
//       {questions.length === 0 ? (
//         <p className={classes.noQuestions}>No questions found.</p>
//       ) : (
//         <>
//           <ul className={classes.questionList}>
//             {currentQuestions.map((q) => (
//               <li
//                 key={q.question_id}
//                 className={classes.questionItem}
//                 onClick={() => navigate(`/question/${q.question_id}`)}
//               >
//                 <h4 className={classes.title}>{q.title}</h4>
//                 <p className={classes.description}>
//                   {q.content?.length > 100
//                     ? q.content.slice(0, 100) + "..."
//                     : q.content}
//                 </p>
//                 <div className={classes.meta}>
//                   <span>
//                     <strong>User ID:</strong> {q.user_id}
//                   </span>
//                   <span>
//                     <strong>Username:</strong> {q.user_name || "Unknown"}
//                   </span>
//                 </div>
//               </li>
//             ))}
//           </ul>

//           {/* Pagination Controls */}
//           {totalPages > 1 && (
//             <div className={classes.pagination}>
//               <button
//                 className={classes.pageButton}
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//               >
//                 Prev
//               </button>

//               {Array.from({ length: totalPages }, (_, index) => (
//                 <button
//                   key={index + 1}
//                   className={`${classes.pageButton} ${
//                     currentPage === index + 1 ? classes.activePage : ""
//                   }`}
//                   onClick={() => handlePageChange(index + 1)}
//                 >
//                   {index + 1}
//                 </button>
//               ))}

//               <button
//                 className={classes.pageButton}
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default QuestionList;
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




