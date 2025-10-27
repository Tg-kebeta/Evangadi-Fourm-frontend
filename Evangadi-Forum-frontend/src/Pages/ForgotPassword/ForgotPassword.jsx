import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../axiosConfig";
import Layout from "../../component/Layout/Layout";
import LoadingSpinner, { ButtonSpinner } from "../../component/LoadingSpinner/LoadingSpinner";
import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email.trim()) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("api/user/forgot-password", { email });
      setSuccess(response.data.message);
      setSubmitted(true);
      
      // In development, show the reset token
      if (response.data.resetToken) {
        setResetToken(response.data.resetToken);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("api/user/reset-password", {
        token: resetToken,
        password: newPassword
      });
      setSuccess(response.data.message);
      setShowResetForm(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h2 className={styles.title}>Password Recovery</h2>
            <p className={styles.subtitle}>
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {error && (
            <div className={`${styles.alert} ${styles.alertError}`}>
              {error}
            </div>
          )}

          {success && (
            <div className={`${styles.alert} ${styles.alertSuccess}`}>
              {success}
            </div>
          )}

          {!submitted ? (
            <form onSubmit={handleEmailSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder="Enter your email address"
                  required
                  disabled={loading}
                />
              </div>

              <ButtonSpinner
                type="submit"
                loading={loading}
                className={styles.submitButton}
                disabled={loading}
              >
                Send Reset Link
              </ButtonSpinner>

              <div className={styles.footer}>
                <Link to="/login" className={styles.backLink}>
                  ← Back to Login
                </Link>
              </div>
            </form>
          ) : (
            <div className={styles.successContent}>
              <div className={styles.successIcon}>✅</div>
              <p className={styles.successMessage}>
                If your email is registered, you'll receive a password reset link shortly.
              </p>
              
              {/* Development only - show reset form */}
              {resetToken && process.env.NODE_ENV === 'development' && (
                <div className={styles.devSection}>
                  <h4>Development Mode - Reset Password</h4>
                  <p>Use this token to reset your password: <code>{resetToken}</code></p>
                  
                  {!showResetForm ? (
                    <button
                      type="button"
                      onClick={() => setShowResetForm(true)}
                      className={styles.devButton}
                    >
                      Reset Password Now
                    </button>
                  ) : (
                    <form onSubmit={handlePasswordReset} className={styles.resetForm}>
                      <div className={styles.formGroup}>
                        <label htmlFor="newPassword" className={styles.label}>
                          New Password
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className={styles.input}
                          placeholder="Enter new password"
                          required
                          disabled={loading}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword" className={styles.label}>
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={styles.input}
                          placeholder="Confirm new password"
                          required
                          disabled={loading}
                        />
                      </div>

                      <div className={styles.buttonGroup}>
                        <ButtonSpinner
                          type="submit"
                          loading={loading}
                          className={styles.submitButton}
                          disabled={loading}
                        >
                          Reset Password
                        </ButtonSpinner>
                        
                        <button
                          type="button"
                          onClick={() => setShowResetForm(false)}
                          className={styles.cancelButton}
                          disabled={loading}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              <div className={styles.footer}>
                <Link to="/login" className={styles.backLink}>
                  ← Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
