// assets/js/roadmap.js
document.addEventListener("DOMContentLoaded", () => {
    const careerTitle = document.getElementById("career-title");
    const careerDesc = document.getElementById("career-description");
    const futureScope = document.getElementById("career-futureScope");
    const salary = document.getElementById("career-salary");
    const workload = document.getElementById("career-workload");
    const howToStart = document.getElementById("career-start");
    const roadmapContainer = document.getElementById("roadmap-container");
  
    const selectedCareer = JSON.parse(localStorage.getItem("selectedCareer"));
  
    if (!selectedCareer) {
      careerTitle.textContent = "No Career Selected";
      roadmapContainer.innerHTML = "<p>Please go back and choose a career.</p>";
      return;
    }
  
    careerTitle.textContent = selectedCareer.name;
    careerDesc.textContent = selectedCareer.description || "No description available.";
    futureScope.innerHTML = `<strong>Future Scope:</strong> ${selectedCareer.futureScope || "Not specified"}`;
    salary.textContent = selectedCareer.averageSalary || "Not available";
    workload.textContent = selectedCareer.workload || "Not specified";
    howToStart.textContent = selectedCareer.howToStart || "No info available";
  
    if (selectedCareer.roadmap && selectedCareer.roadmap.length > 0) {
      roadmapContainer.innerHTML = "<h3>Career Roadmap</h3>";
  
      selectedCareer.roadmap.forEach((section) => {
        const sectionDiv = document.createElement("div");
        sectionDiv.classList.add("roadmap-section");
  
        const header = document.createElement("h3");
        header.innerHTML = `${section.level} <i class="fas fa-chevron-down"></i>`;
  
        const list = document.createElement("ul");
  
        section.steps.forEach((step) => {
          const li = document.createElement("li");
          li.textContent = step;
          list.appendChild(li);
        });
  
        header.addEventListener("click", () => {
          list.classList.toggle("show");
          const icon = header.querySelector("i");
          icon.classList.toggle("fa-chevron-up");
          icon.classList.toggle("fa-chevron-down");
        });
  
        sectionDiv.appendChild(header);
        sectionDiv.appendChild(list);
        roadmapContainer.appendChild(sectionDiv);
      });
    } else {
      roadmapContainer.innerHTML += "<p>No roadmap available for this career.</p>";
    }
  });
  