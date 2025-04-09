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

// Fetch job categories
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

// Location autosuggestions
locationInput.addEventListener('input', async () => {
  const val = locationInput.value;
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
    query: searchInput.value,
    location: locationInput.value,
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
    const div = document.createElement('div');
    div.className = 'job-card';
    div.innerHTML = `
      <h3>${job.title}</h3>
      <p><strong>${job.company?.display_name || 'Unknown Company'}</strong> — ${job.location?.display_name || 'N/A'}</p>
      <p>${job.description?.substring(0, 200) || 'No description'}...</p>
      <a href="${job.redirect_url}" target="_blank" class="apply-link">Apply</a>
    `;
    results.appendChild(div);
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

// Initialize
fetchCategories();
fetchJobs(currentPage);
