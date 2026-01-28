import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const submit = async () => {
    if (!fullName || !email || !password) {
      alert("All fields are required");
      return;
    }

    const res = await fetch("http://localhost:52705/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        email,
        password
      })
    });

    if (res.ok) {
      alert("Registration successful. Please login.");
      nav("/login");
    } else {
      alert("Registration failed");
    }
  };

  // return (
  //   <div className="container mt-5">
  return (
  <div className="page-container">

      <div className="card col-md-5 mx-auto p-4 shadow">
        <h3 className="text-center mb-4">Register</h3>

        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            className="form-control"
            placeholder="Enter full name"
            onChange={e => setFullName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button className="btn btn-primary w-100" onClick={submit}>
          Register
        </button>

        <p className="text-center mt-3">
          Already registered?{" "}
          <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
