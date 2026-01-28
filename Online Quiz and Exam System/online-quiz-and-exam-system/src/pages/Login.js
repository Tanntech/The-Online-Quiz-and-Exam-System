import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import { googleLogin } from "../services/api";



const isValidEmail = (email) => {
  return email.endsWith("@gmail.com");
};


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  // ================= NORMAL LOGIN =================
  const submit = async () => {
    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Invalid Email");
      return;
    }

    try {
      const res = await fetch("http://localhost:52705/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const error = await res.text();
        alert(error);   // shows backend message
        return;
      }

      const user = await res.json();
      sessionStorage.setItem("user", JSON.stringify(user));
      nav("/");

    } catch (err) {
      alert("Server error. Please try again later.");
    }
  };


  // ================= GOOGLE LOGIN =================
  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: "942122630629-943dhruud3laaohl2hbv863sgs79e4dj.apps.googleusercontent.com",
        callback: handleGoogleLogin
      });

      google.accounts.id.renderButton(
        document.getElementById("googleLoginBtn"),
        {
          theme: "outline",
          size: "large",
          width: "100%"
        }
      );
    }
  }, []);

  const handleGoogleLogin = async (response) => {
    const userObject = JSON.parse(
      atob(response.credential.split(".")[1])
    );

    const googleUser = {
      fullName: userObject.name,
      email: userObject.email
    };

    const savedUser = await googleLogin(googleUser);

    sessionStorage.setItem("user", JSON.stringify(savedUser));
    nav("/");
  };


  // return (
  //   <div className="container mt-5">
  return (
    <div className="page-container">

      <div className="card col-md-5 mx-auto p-4 shadow">
        <h3 className="text-center mb-4">Login</h3>

        {/* Email Login */}
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <button className="btn btn-primary w-100 mb-3" onClick={submit}>
          Login
        </button>

        <div className="text-center mb-2 fw-bold">OR</div>

        {/* Google Login Button */}
        <div id="googleLoginBtn" className="d-flex justify-content-center"></div>

        <p className="text-center mt-3">
          New user? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
