import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import $ from "jquery";
import "bootstrap";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add your form submission logic here
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    // Add your password reset logic here
  };

  const toggleForm = () => {
    $(".login-box").toggleClass("flipped");
  };

  return (
    <div>
      <section className="material-half-bg">
        <div className="cover"></div>
      </section>
      <section className="login-content">
        <div className="logo">
          <h1>Vali</h1>
        </div>
        <div className="login-box">
          {!forgotPassword && (
            <form className="login-form" onSubmit={handleSubmit}>
              <h3 className="login-head">
                <i className="bi bi-person me-2"></i>SIGN IN
              </h3>
              <div className="mb-3">
                <label className="form-label">USERNAME</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="mb-3">
                <label className="form-label">PASSWORD</label>
                <input
                  className="form-control"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <div className="utility">
                  <div className="form-check">
                    <label className="form-check-label">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span className="label-text">Stay Signed in</span>
                    </label>
                  </div>
                  <p className="semibold-text mb-2">
                    <a href="#" onClick={toggleForm}>
                      Forgot Password ?
                    </a>
                  </p>
                </div>
              </div>
              <div className="mb-3 btn-container d-grid">
                <button className="btn btn-primary btn-block">
                  <i className="bi bi-box-arrow-in-right me-2 fs-5"></i>
                  SIGN IN
                </button>
              </div>
            </form>
          )}
          {/* forgotPassword && */}
          {
            <form className="forget-form" onSubmit={handleForgotPasswordSubmit}>
              <h3 className="login-head">
                <i className="bi bi-person-lock me-2"></i>Forgot Password ?
              </h3>
              <div className="mb-3">
                <label className="form-label">EMAIL</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
              </div>
              <div className="mb-3 btn-container d-grid">
                <button className="btn btn-primary btn-block">
                  <i className="bi bi-unlock me-2 fs-5"></i>
                  RESET
                </button>
              </div>
              <div className="mb-3 mt-3">
                <p className="semibold-text mb-0">
                  <a href="#" onClick={toggleForm}>
                    <i className="bi bi-chevron-left me-1"></i> Back to Login
                  </a>
                </p>
              </div>
            </form>
          }
        </div>
      </section>
    </div>
  );
}

export default Login;
