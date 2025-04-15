const API_BASE = 'https://career-guidance-6ocm.onrender.com';

const searchInput = document.getElementById('query');
const locationInput = document.getElementById('location');
const categorySelect = document.getElementById('category');
const minSalaryInput = document.getElementById('min_salary');
const maxSalaryInput = document.getElementById('max_salary');
const minVal = document.getElementById('minVal');
const maxVal = document.getElementById('maxVal');
const searchBtn = document.getElementById('search');
const results = document.getElementById('results');
const pageSpan = document.getElementById('page');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const suggestions = document.getElementById('location-suggestions');

let currentPage = 1;

// Fetch categories
async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE}/api/categories`);
    const data = await res.json();
    data.results.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.tag;
      option.textContent = cat.label;
      categorySelect.appendChild(option);
    });
  } catch (err) {
    console.error('Failed to load categories:', err);
  }
}

// Location suggestions
locationInput.addEventListener('input', async () => {
  const val = locationInput.value.trim();
  if (val.length < 2) return;

  try {
    const res = await fetch(`${API_BASE}/api/locations?location=${encodeURIComponent(val)}`);
    const data = await res.json();
    suggestions.innerHTML = '';
    data.results.forEach(loc => {
      const option = document.createElement('option');
      option.value = loc.display_name;
      suggestions.appendChild(option);
    });
  } catch (err) {
    console.error('Location suggestion error:', err);
  }
});

// Salary sliders
minSalaryInput.oninput = () => (minVal.textContent = minSalaryInput.value);
maxSalaryInput.oninput = () => (maxVal.textContent = maxSalaryInput.value);

// Fetch jobs
async function fetchJobs(page = 1) {
  const params = new URLSearchParams({
    query: searchInput.value.trim(),
    location: locationInput.value.trim(),
    category: categorySelect.value,
    min_salary: minSalaryInput.value,
    max_salary: maxSalaryInput.value,
    page
  });

  try {
    const res = await fetch(`${API_BASE}/api/jobs?${params.toString()}`);
    const data = await res.json();
    renderJobs(data.results || []);
    pageSpan.textContent = currentPage;
  } catch (err) {
    console.error('Job fetch error:', err);
    results.innerHTML = '<p>Error loading jobs. Please try again later.</p>';
  }
}

// Render job cards
function renderJobs(jobs) {
  results.innerHTML = '';

  if (!jobs.length) {
    results.innerHTML = '<p>No jobs found.</p>';
    return;
  }

  jobs.forEach(job => {
    const card = document.createElement('div');
    card.className = 'job-card';

    let jobLocation = job.location?.display_name || 'N/A';
    const locationParts = jobLocation.split(', ');
    jobLocation = locationParts.slice(0, -1).join(', '); // Remove country

    const salaryBadge = job.salary ? `<span class="badge salary">${job.salary}</span>` : '';
    const contractBadge = job.contract_type ? `<span class="badge contract">${job.contract_type}</span>` : '';
    const postedDate = job.created ? new Date(job.created).toLocaleDateString() : 'N/A';

    card.innerHTML = `
      <h3>${job.title}</h3>
      <p><strong>${job.company?.display_name || 'Unknown Company'}</strong> — ${jobLocation}</p>
      <p>${job.description?.substring(0, 200) || 'No description'}...</p>
      <div class="badges">
        ${salaryBadge} ${contractBadge}
      </div>
      <p class="posted-date">Posted on: ${postedDate}</p>
      <a href="${job.redirect_url}" target="_blank" class="apply-link">Apply</a>
    `;

    results.appendChild(card);
  });
}

// Event listeners
searchBtn.addEventListener('click', () => {
  currentPage = 1;
  fetchJobs(currentPage);
});

nextBtn.addEventListener('click', () => {
  currentPage++;
  fetchJobs(currentPage);
});

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchJobs(currentPage);
  }
});

// Init
fetchCategories();
fetchJobs(currentPage);
