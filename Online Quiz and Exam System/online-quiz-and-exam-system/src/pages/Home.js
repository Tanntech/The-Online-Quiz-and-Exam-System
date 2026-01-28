import { useEffect, useState } from "react";
import { getModules } from "../services/api";
import { useNavigate } from "react-router-dom";

function Home() {
  const [modules, setModules] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    getModules().then(setModules);
  }, []);

  const ensureLogin = () => {
    const user = sessionStorage.getItem("user");
    if (!user) {
      nav("/login");
      return false;
    }
    return true;
  };

  // return (
  //   <div className="container mt-4">
  return (
  <div className="page-container">

    <div className="page-title">
      CDAC DAC – Online Quiz & Mock Tests
    </div>

    <div className="row g-4">
      {modules.map(m => (
        <div className="col-md-4" key={m.moduleId}>
          <div className="module-card">

            <div className="module-title">
              {m.moduleName}
            </div>

            <button
              className="btn-practice w-100"
              onClick={() => {
                if (ensureLogin()) {
                  nav(`/quiz/${m.moduleId}`);
                }
              }}
            >
              Practice Test (Learning Mode)
            </button>

            <hr />

            <div className="mock-title">Mock Tests</div>

            <div className="mock-buttons">
              {[1, 2, 3, 4, 5].map(mockId => (
                <button
                  key={mockId}
                  className="btn-mock"
                  onClick={() => {
                    if (ensureLogin()) {
                      nav(`/mock/${m.moduleId}/${mockId}`);
                    }
                  }}
                >
                  Mock {mockId}
                </button>
              ))}
            </div>

          </div>
        </div>
      ))}
    </div>

  </div>
);

}

export default Home;
