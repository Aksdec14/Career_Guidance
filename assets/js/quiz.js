document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quiz-form");
  const questions = Array.from(document.querySelectorAll(".question"));
  const submitButton = form.querySelector("button[type='submit']");

  let currentQuestionIndex = 0;

  // Hide all questions initially
  questions.forEach((q, i) => {
    q.style.display = i === 0 ? "block" : "none";
  });

  // Hide the submit button until the last question
  submitButton.style.display = "none";

  // Create Next button
  const nextBtn = document.createElement("button");
  nextBtn.type = "button";
  nextBtn.textContent = "Next";
  nextBtn.className = "bg-[#00c3ff] text-black font-bold py-2 px-6 rounded-xl hover:bg-[#00a8e0] transition duration-300";
  form.appendChild(nextBtn);

  nextBtn.addEventListener("click", () => {
    const currentQuestion = questions[currentQuestionIndex];
    const selected = currentQuestion.querySelector("input:checked");

    if (!selected) {
      alert("Please select an answer before continuing.");
      return;
    }

    // Hide current and show next
    currentQuestion.style.display = "none";
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
      questions[currentQuestionIndex].style.display = "block";

      // If it's the last question, show submit, hide next
      if (currentQuestionIndex === questions.length - 1) {
        nextBtn.style.display = "none";
        submitButton.style.display = "block";
      }
    }
  });

  // Handle final form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const selectedTraits = [];

    for (let [_, value] of formData.entries()) {
      selectedTraits.push(value);
    }

    if (selectedTraits.length < questions.length) {
      alert("Please answer all questions.");
      return;
    }

    localStorage.setItem("quizAnswers", JSON.stringify(selectedTraits));
    window.location.href = "recommendation.html";
  });
});
