import React, { useContext, useState } from "react";
import styles from "./login.module.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../axiosConfig";
import { UserContext } from "../../component/Dataprovider/DataProvider";
import Layout from "../../component/Layout/Layout";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { ButtonSpinner } from "../../component/LoadingSpinner/LoadingSpinner";

const Login = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useContext(UserContext);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setErrorMsg("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("api/user/login", formData);

      if (response.data.message === 'User login successful') {
        localStorage.setItem('token', response.data.token);
        setUserData({ ...(userData || {}), token: response.data.token });
        navigate("/home");
      } else {
        setErrorMsg(response.data.message || "Login failed");
      }
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Invalid credentials or server error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className={styles.pageWrapper}>
        <div className={styles.loginPageContainer}>
          <div className={styles.blueShape}></div>

          <div className={styles.loginLeft}>
            <div className={styles.loginBox}>
              <h2 className={styles.loginHeading}>Login to your account</h2>
              <p>
                Don't have an account?{" "}
                <Link to="/register">Create a new account</Link>
              </p>

              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
                <div className={styles.password_container}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <span
                    className={styles.eye_icon}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible />
                    ) : (
                      <AiOutlineEye />
                    )}
                             
                  </span>
                </div>
                <div className={styles.loginFooter}>
                  <Link to="/forgot-password" className={styles.forgetLink}>
                    Forgot password?          
                  </Link>
                </div>

                {errorMsg && <p className={styles.error}>{errorMsg}</p>}

                <ButtonSpinner
                  type="submit"
                  loading={loading}
                  className={styles.loginButton}
                  disabled={loading}
                >
                  Login
                </ButtonSpinner>
              </form>
            </div>
          </div>

          <div className={styles.loginRight}>
            <div className={styles.aboutSection}>
              <h4 className={styles.aboutTitle}>About</h4>
              <h2 className={styles.aboutHeading}>Evangadi Networks</h2>
              <p className={styles.aboutText}>
                No matter what stage of life you are in, whether you’re just
                starting elementary school or being promoted to CEO of a Fortune
                500 company, you have much to offer to those who are trying to
                follow in your footsteps.
              </p>
              <p className={styles.aboutText}>
                Whether you are willing to share your knowledge or you are just
                looking to meet mentors of your own, please start by joining the
                network here.
              </p>
              <Link to="/how-it-works">
                <button className={styles.aboutButton}>HOW IT WORKS</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
