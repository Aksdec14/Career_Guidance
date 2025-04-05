document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
  
    if (menuToggle && navLinks) {
      menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
      });
    }
  });
  
function toggleJob(header) {
    header.classList.toggle("active");
    const details = header.nextElementSibling;
    details.classList.toggle("show");
  }
  
