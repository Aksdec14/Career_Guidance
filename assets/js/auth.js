const toggleLink = document.getElementById('toggle-link');
const formTitle = document.getElementById('form-title');
const emailInput = document.getElementById('email');
const authForm = document.getElementById('auth-form');
const submitButton = authForm.querySelector('button');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

let isLogin = true;

const updateForm = () => {
  if (isLogin) {
    formTitle.textContent = 'Login';
    emailInput.classList.add('hidden');
    submitButton.textContent = 'Login';
    document.querySelector('.toggle-text').innerHTML = `Don't have an account? <span id="toggle-link">Sign Up</span>`;
  } else {
    formTitle.textContent = 'Sign Up';
    emailInput.classList.remove('hidden');
    submitButton.textContent = 'Sign Up';
    document.querySelector('.toggle-text').innerHTML = `Already have an account? <span id="toggle-link">Login</span>`;
  }

  document.getElementById('toggle-link').addEventListener('click', () => {
    isLogin = !isLogin;
    updateForm();
  });
};

toggleLink.addEventListener('click', () => {
  isLogin = !isLogin;
  updateForm();
});

authForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = usernameInput.value;
  const password = passwordInput.value;
  const email = emailInput.value;

  const payload = isLogin
    ? { username, password }
    : { username, password, email };

  const endpoint = isLogin ? '/login' : '/signup';

  try {
    const res = await fetch(`https://career-guidance-6ocm.onrender.com${endpoint}`, {  // Updated URL
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const msg = await res.text();

    if (res.ok) {
      window.location.href = 'quiz.html'; // redirect on success
    } else {
      alert(`Error: ${msg}`);
    }
  } catch (err) {
    alert('Something went wrong. Please try again.');
    console.error(err);
  }
});
