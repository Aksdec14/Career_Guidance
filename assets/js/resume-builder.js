// Fields to update in the preview
const fields = ['name', 'title', 'email', 'phone', 'summary', 'experience', 'education'];

// Update text fields in real-time
fields.forEach(id => {
  const inputField = document.getElementById(id);
  const previewField = document.getElementById(`preview-${id}`);

  inputField.addEventListener('input', () => {
    previewField.innerText = inputField.value.trim() || `Your ${id.charAt(0).toUpperCase() + id.slice(1)}`;
  });
});

// Handle skills input
document.getElementById('skills').addEventListener('input', () => {
  const skillsInput = document.getElementById('skills').value;
  const skillsArray = skillsInput.split(',').map(skill => skill.trim()).filter(Boolean);

  const skillsList = document.getElementById('preview-skills');
  skillsList.innerHTML = ''; // Clear previous list

  skillsArray.forEach(skill => {
    const li = document.createElement('li');
    li.textContent = skill;
    skillsList.appendChild(li);
  });
});

// Handle image upload and preview
document.getElementById('photo').addEventListener('change', function () {
  const file = this.files[0];

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const img = document.getElementById('profile-pic');
      img.src = e.target.result;
      img.style.display = 'block';
    };

    reader.readAsDataURL(file);
  }
});

// Download resume as PDF
function downloadResume() {
  const element = document.getElementById('resume-card');
  const opt = {
    margin: 0.5,
    filename: 'resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
}
