import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const nav = useNavigate();


  // Email validation
const isValidEmail = (email) => {
  return email.endsWith("@gmail.com");
};

// Password validation
const isStrongPassword = (password) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=])[A-Za-z\d@$!%*?&#^()_+\-=]{8,}$/;
  return regex.test(password);
};



  const submit = async () => {
  if (!fullName || !email || !mobile || !password || !confirmPassword) {
    alert("All fields are required");
    return;
  }

  if (!isValidEmail(email)) {
    alert("Email must be a valid @gmail.com address");
    return;
  }

  if (!isStrongPassword(password)) {
    alert(
      "Password must contain:\n" +
      "- Minimum 8 characters\n" +
      "- Uppercase letter\n" +
      "- Lowercase letter\n" +
      "- Number\n" +
      "- Symbol"
    );
    return;
  }

  if (password !== confirmPassword) {
    alert("Password and Confirm Password do not match");
    return;
  }

  if (mobile.length < 10) {
    alert("Enter a valid mobile number");
    return;
  }

  const res = await fetch("http://localhost:52705/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName,
      email,
      password,
      mobileNumber: mobile
    })
  });

  if (res.ok) {
    alert("Registration successful. Please login.");
    nav("/login");
  } else {
    alert("Registration failed");
  }
};


  return (
    <div className="page-container">
      <div className="card col-md-5 mx-auto p-4 shadow">
        <h3 className="text-center mb-4">Register</h3>

        <input
          className="form-control mb-3"
          placeholder="Full Name"
          onChange={e => setFullName(e.target.value)}
        />

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="tel"
          className="form-control mb-3"
          placeholder="Mobile Number"
          onChange={e => setMobile(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Confirm Password"
          onChange={e => setConfirmPassword(e.target.value)}
        />

        <button className="btn btn-primary w-100" onClick={submit}>
          Register
        </button>

        <p className="text-center mt-3">
          Already registered? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
