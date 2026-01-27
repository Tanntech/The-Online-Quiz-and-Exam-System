import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import { getAttemptSummary, getLatestResultStats } from "../services/api";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const nav = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [attempts, setAttempts] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getAttemptSummary(user.userId).then(setAttempts);
    getLatestResultStats(user.userId).then(setStats);
  }, [user.userId]);

  if (!stats) return <h4 className="text-center mt-5">Loading Dashboard...</h4>;

  // ================= PIE CHART =================
  const pieData = {
    labels: attempts.map(a => a.moduleName),
    datasets: [
      {
        data: attempts.map(a => a.attempts),
        backgroundColor: ["#198754", "#0d6efd", "#ffc107", "#dc3545"]
      }
    ]
  };

  return (
    <div className="container-fluid px-4 mt-4">

      {/* ================= HEADER ================= */}
      <h3>
        Welcome, {user.fullName}{" "}
        <span className="text-muted fs-6">
          (UserID: {user.email})
        </span>
      </h3>
      <p className="text-muted">
        Course: CDAC DAC, Last Login: {stats.lastLogin}
      </p>

      {/* ================= TOP CARDS ================= */}
      <div className="row g-4">

        {/* ================= LATEST RESULT ================= */}
        <div className="col-md-4">
          <div className="card p-3 h-100">
            <h5>Current Test Result</h5>

            <p className="mt-2">
              <b>{stats.moduleName}</b>
            </p>

            <p>Score: <b>{stats.score} / 40</b></p>
            <p>Attempted: {stats.attempted}</p>
            <p>Unattempted: {stats.unattempted}</p>

            {/* ===== ACTION BUTTONS INSIDE SAME CARD ===== */}
            <div className="d-grid gap-2 mt-3">
              <button
                className="btn btn-success"
                onClick={() => nav("/")}
              >
                Start Practice Test
              </button>

              <button
                className="btn btn-primary"
                onClick={() => nav("/")}
              >
                Take Next Mock Test
              </button>
            </div>
          </div>
        </div>

        {/* ================= PERFORMANCE SUMMARY ================= */}
        <div className="col-md-4">
          <div className="card p-3 h-100">
            <h5>Performance Summary</h5>

            <p>Total Tests: <b>{stats.totalTests}</b></p>
            <p>Practice Tests: <b>{stats.practiceTests}</b></p>
            <p>Mock Tests: <b>{stats.mockTests}</b></p>
            <p>Best Score: <b>{stats.bestScore}</b></p>
            {/* <p>Average Score: <b>{stats.averageScore}</b></p> */}
          </div>
        </div>

        {/* ================= PIE CHART ================= */}
        <div className="col-md-4">
          <div className="card p-3 h-100">
            <h5 className="text-center">Test Attempts Distribution</h5>
            <Pie data={pieData} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
