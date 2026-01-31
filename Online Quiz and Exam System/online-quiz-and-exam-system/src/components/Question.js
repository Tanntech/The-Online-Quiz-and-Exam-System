function Question({ q, index, answers, setAnswers, attemptType }) {

  const handleChange = (option) => {
    setAnswers({
      ...answers,
      [index]: option
    });
  };

  // user has clicked something
  const hasClicked = answers[index] !== undefined;

  // show correct answer ONLY for practice & free
  const showCorrectAnswer =
    (attemptType === "practice" || attemptType === "free") &&
    hasClicked &&
    q.correctOption;

  const correctAnswerText =
    q.correctOption === "A" ? q.optionA :
    q.correctOption === "B" ? q.optionB :
    q.correctOption === "C" ? q.optionC :
    q.correctOption === "D" ? q.optionD :
    "";

  return (
    <div className="mt-3">

      <p className="fw-semibold">
        {index + 1}. {q.questionText}
      </p>

      {["A", "B", "C", "D"].map(opt => (
        <div className="form-check mt-2" key={opt}>
          <input
            className="form-check-input"
            type="radio"
            name={`q${index}`}
            checked={answers[index] === opt}
            onChange={() => handleChange(opt)}
          />
          <label className="form-check-label">
            {q["option" + opt]}
          </label>
        </div>
      ))}

      {/* ✅ THIS IS YOUR REQUIREMENT */}
      {showCorrectAnswer && (
        <div className="mt-2 fw-semibold">
          Correct Answer: {correctAnswerText}
        </div>
      )}
    </div>
  );
}

export default Question;

