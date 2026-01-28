const BASE_URL = "http://localhost:52705/api";

// -------- AUTH --------
export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};

// -------- MODULES --------
export const getModules = async () => {
  const res = await fetch(`${BASE_URL}/modules`);
  return res.json();
};

// -------- QUIZ --------
export const getQuestions = async (moduleId) => {
  const res = await fetch(`${BASE_URL}/quiz/${moduleId}`);
  return res.json();
};

// -------- RESULT --------
export async function saveResult(result) {
  const res = await fetch("http://localhost:52705/api/result", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId: result.userId,
      moduleId: result.moduleId,
      score: result.score,
      attempted: result.attempted,
      unattempted: result.unattempted,
      testType: result.testType   // ✅ MUST BE HERE
    })
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("BACKEND ERROR:", error);
    throw new Error(error);
  }
}




export const googleLogin = async (user) => {
  const res = await fetch("http://localhost:52705/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });
  return res.json();
};


export const getAttemptSummary = async (userId) => {
  const res = await fetch(
    `http://localhost:52705/api/result/attempts/${userId}`
  );
  return res.json();
};

// export const getMockQuestions = async (moduleId, mockId) => {
//   const res = await fetch(
//     `http://localhost:52705/api/mock/${moduleId}/${mockId}`
//   );
//   return res.json();
// };

export const getMockQuestions = async (moduleId, mockNumber) => {
  const res = await fetch(
    `http://localhost:52705/api/mock/${moduleId}/${mockNumber}`
  );

  if (!res.ok) throw new Error("Failed to load mock test");
  return res.json();
};



export async function getLatestResultStats(userId) {
  const res = await fetch(
    `http://localhost:52705/api/result/latest/${userId}`
  );

  // 🚨 If backend returns error page / HTML
  if (!res.ok) {
    return {
      moduleName: "N/A",
      score: 0,
      attempted: 0,
      unattempted: 0,
      totalTests: 0,
      practiceTests: 0,
      mockTests: 0,
      bestScore: 0
    };
  }

  const contentType = res.headers.get("content-type");

  // 🚨 If response is NOT JSON (HTML page)
  if (!contentType || !contentType.includes("application/json")) {
    return {
      moduleName: "N/A",
      score: 0,
      attempted: 0,
      unattempted: 0,
      totalTests: 0,
      practiceTests: 0,
      mockTests: 0,
      bestScore: 0
    };
  }

  // ✅ Safe to parse JSON now
  return await res.json();
}

