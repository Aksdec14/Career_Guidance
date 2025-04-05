document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("quiz-form");
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const formData = new FormData(form);
      const selectedTraits = [];
  
      for (let [_, value] of formData.entries()) {
        selectedTraits.push(value);
      }
  
      if (selectedTraits.length < 6) {
        alert("Please answer all questions.");
        return;
      }
  
      localStorage.setItem("quizAnswers", JSON.stringify(selectedTraits));
      window.location.href = "recommendation.html";
    });
  });
  