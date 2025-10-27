import { useRef, useState } from "react";
import classes from "./register.module.css";
import axios from "../../axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../component/Layout/Layout";
import { FaEye, FaEyeSlash } from "react-icons/fa";


function Register() {
  const navigate = useNavigate();
  const usernameDom = useRef();
  const firstnameDom = useRef();
  const lastnameDom = useRef();
  const emailDom = useRef();
  const passwordDom = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const usernameValue = usernameDom.current.value.trim();
    const firstValue = firstnameDom.current.value.trim();
    const lastValue = lastnameDom.current.value.trim();
    const emailValue = emailDom.current.value.trim();
    const passValue = passwordDom.current.value.trim();

    if (
      !usernameValue ||
      !firstValue ||
      !lastValue ||
      !emailValue ||
      !passValue
    ) {
      setError("Please provide all required information.");
      setSuccess("");
      return;
    }

    try {
      await axios.post("api/user/register", {
        username: usernameValue,
        first_name: firstValue,
        last_name: lastValue,
        email: emailValue,
        password: passValue,
      });

      setError("");
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong!");
      setSuccess("");
    }
  }

  return (
    <Layout>
      <section className={classes.login_container}>
        <div className={classes.login_wrapper}>
          <div className={classes.login_form}>
            <form onSubmit={handleSubmit} className={classes.login_form_input}>
              <h1 className={classes.login_title}>Join the network</h1>
              <small>
                Already have an account?<Link to="/login"> Sign in</Link>
              </small>

              {error && <p className={classes.error}>{error}</p>}
              {success && <p className={classes.success}>{success}</p>}

              <div className={classes.inputs}>
                <div>
                  <input
                    className={`${classes.user} ${
                      error && !usernameDom.current?.value
                        ? classes.inputError
                        : ""
                    }`}
                    ref={usernameDom}
                    type="text"
                    placeholder="Username"
                  />
                </div>
                <br />
                <div className={classes.first_last}>
                  <div>
                    <input
                      className={`${classes.first} ${
                        error && !firstnameDom.current?.value
                          ? classes.inputError
                          : ""
                      }`}
                      ref={firstnameDom}
                      type="text"
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <input
                      className={`${classes.last} ${
                        error && !lastnameDom.current?.value
                          ? classes.inputError
                          : ""
                      }`}
                      ref={lastnameDom}
                      type="text"
                      placeholder="Last Name"
                    />
                  </div>
                </div>
                <br />
                <div>
                  <input
                    className={`${classes.email} ${
                      error && !emailDom.current?.value
                        ? classes.inputError
                        : ""
                    }`}
                    ref={emailDom}
                    type="email"
                    placeholder="Email"
                  />
                </div>
                <br />
                <div className={classes.passwordWrapper}>
                  <input
                    ref={passwordDom}
                    type={showPassword ? "text" : "password"}
                    className={`${classes.password} ${
                      error && !passwordDom.current?.value
                        ? classes.inputError
                        : ""
                    }`}
                    placeholder="Password"
                  />
                  <span
                    className={classes.eyeIcon}
                    onClick={() => setShowPassword(!showPassword)}
                    role="button"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                <br />
                <div className={classes.agree2}>
                  <small>
                    I agree to the <Link>privacy policy</Link>
                    <span> and </span> <Link>terms of service</Link>.
                  </small>
                </div>

                <button type="submit">Agree and Join</button>

                <div className={classes.account}>
                  <p className={classes.agree}>
                    <Link to="/login">Already have an account?</Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className={classes.Evangadi_description}>
          <small className={classes.title_link}>
            <Link>About</Link>
          </small>
          <h2 className={classes.title}>Evangadi Networks</h2>
          <p>
            No matter what stage of life you are in, whether you’re just
            starting elementary school or being promoted to CEO of a Fortune 500
            company, you have much to offer to those who are trying to follow in
            your footsteps.
          </p>
          <p className="font-p mg-bt-30">
            Whether you are willing to share your knowledge or you are just
            looking to meet mentors of your own, please start by joining the
            network here.
          </p>
          <Link to="/how-it-works">
            <button className={classes.aboutButton}>HOW IT WORKS</button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}

export default Register;
