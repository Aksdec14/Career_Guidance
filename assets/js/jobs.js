const jobListingsContainer = document.getElementById("job-listings");
const searchInput = document.getElementById("jobSearchInput");

// ✅ Render backend URL
const apiUrl = 'https://career-guidance-16f0.onrender.com/api/jobs';

async function fetchJobs(query = "software developer", location = "India") {
  jobListingsContainer.innerHTML = `<div class="loader"></div>`;

  // Filter handling
  let filters = [];
  if (document.getElementById("remoteFilter").checked) filters.push("remote");
  if (document.getElementById("fullTimeFilter").checked) filters.push("full-time");
  if (document.getElementById("partTimeFilter").checked) filters.push("part-time");
  if (document.getElementById("internshipFilter").checked) filters.push("internship");

  const filterQuery = filters.length ? query + " " + filters.join(" ") : query;

  const url = `${apiUrl}?query=${encodeURIComponent(filterQuery)}&location=${encodeURIComponent(location)}&page=1&num_pages=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    displayJobs(data.data);
  } catch (error) {
    jobListingsContainer.innerHTML = "<p>Failed to fetch jobs. Please try again later.</p>";
    console.error("Error fetching jobs:", error);
  }
}

function displayJobs(jobs) {
  if (!jobs || jobs.length === 0) {
    jobListingsContainer.innerHTML = "<p>No jobs found.</p>";
    return;
  }

  jobListingsContainer.innerHTML = "";

  jobs.forEach((job) => {
    const jobEl = document.createElement("div");
    jobEl.classList.add("job-listing");

    jobEl.innerHTML = `
      <div class="job-header">
        <span><strong>${job.job_title}</strong> at ${job.employer_name}</span>
        <span class="arrow">&#9660;</span>
      </div>
      <div class="job-details">
        <p><strong>Location:</strong> ${job.job_city || 'Not specified'}</p>
        <p><strong>Description:</strong> ${job.job_description?.slice(0, 200) || 'No description'}...</p>
        <p><strong>Apply:</strong> <a href="${job.job_apply_link}" target="_blank">Click here</a></p>
      </div>
    `;

    jobListingsContainer.appendChild(jobEl);

    const header = jobEl.querySelector(".job-header");
    const details = jobEl.querySelector(".job-details");

    header.addEventListener("click", () => {
      header.classList.toggle("active");
      details.classList.toggle("show");
    });
  });
}

// Search input listener
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();
  if (query.length > 2) {
    fetchJobs(query);
  } else {
    fetchJobs();
  }
});

// Filter checkboxes listener
document.querySelectorAll('.job-filters input').forEach(input => {
  input.addEventListener("change", () => {
    const query = searchInput.value.trim() || "software developer";
    fetchJobs(query);
  });
});

// Initial fetch
fetchJobs();
