import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
  setError("");
}, [isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.error || "Something went wrong";

      // Handle special case for signup
      if (!isLogin && message === "User already exists") {
        setError(
          <>
            User already exists.{" "}
            <button
              type="button"
              className="btn btn-link p-0"
               onClick={() => setIsLogin(true)}
            >
              Log in instead
            </button>
          </>
        );
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <h4 className="text-center text-primary fw-bold mb-3">workasana</h4>
        <h5 className="text-center mb-2">
          {isLogin ? "Log in to your account" : "Create an account"}
        </h5>
        <p className="text-muted text-center">
          {isLogin ? "Please enter your details." : "Sign up to start managing your projects."}
        </p>

        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading
              ? isLogin
                ? "Signing in..."
                : "Signing up..."
              : isLogin
              ? "Sign in"
              : "Sign up"}
          </button>
        </form>

        <div className="text-center mt-3">
          {isLogin ? (
            <p>
              Don’t have an account?{" "}
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() => 
                 setIsLogin(false)}
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() => setIsLogin(true)}
              >
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
