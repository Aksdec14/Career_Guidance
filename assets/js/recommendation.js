document.addEventListener("DOMContentLoaded", () => {
    const resultsContainer = document.getElementById("career-results");
    const quizAnswers = JSON.parse(localStorage.getItem("quizAnswers"));
  
    if (!quizAnswers || quizAnswers.length === 0) {
      resultsContainer.innerHTML = "<p>No quiz results found. Please take the quiz first.</p>";
      return;
    }
  
    fetch("assets/data/careers.json")
      .then((res) => res.json())
      .then((careers) => {
        const scoredCareers = careers.map((career) => {
          let score = 0;
          if (career.traits && Array.isArray(career.traits)) {
            career.traits.forEach((trait) => {
              if (quizAnswers.includes(trait)) score += 1;
            });
          }
  
          const matchPercentage = Math.round((score / career.traits.length) * 100);
          return { ...career, score, matchPercentage };
        });
  
        const topCareers = scoredCareers
          .filter((c) => c.score > 0) // filter out irrelevant ones
          .sort((a, b) => b.matchPercentage - a.matchPercentage)
          .slice(0, 5);
  
        if (topCareers.length === 0) {
          resultsContainer.innerHTML = "<p>No matching careers found.</p>";
          return;
        }
  
        topCareers.forEach((career) => {
          const card = document.createElement("div");
          card.className = "career-card";
  
          card.innerHTML = `
            <h3>${career.name}</h3>
            <p>${career.description ? career.description.slice(0, 100) + '...' : "No description available."}</p>
            <div class="progress-container">
              <div class="progress-bar" style="width: ${career.matchPercentage}%;"></div>
            </div>
            <p class="match-percent">${career.matchPercentage}% Match</p>
          `;
  
          // ✅ Store full object instead of just the name
          card.addEventListener("click", () => {
            localStorage.setItem("selectedCareer", JSON.stringify(career));
            window.location.href = "roadmap.html";
          });
  
          resultsContainer.appendChild(card);
        });
      })
      .catch((err) => {
        console.error("Error loading career data:", err);
        resultsContainer.innerHTML = "<p>Error loading career data. Please try again later.</p>";
      });
  });
  