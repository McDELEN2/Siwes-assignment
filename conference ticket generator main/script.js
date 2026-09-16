// ===================== ELEMENT REFERENCES =====================
const form = document.getElementById('ticket-form');
const uploadBox = document.getElementById('upload-box');
const avatarInput = document.getElementById('avatar-input');
const uploadInstructions = document.getElementById('upload-instructions');
const avatarError = document.getElementById('avatar-error');

const fullNameInput = document.getElementById('full-name');
const fullNameError = document.getElementById('full-name-error');

const emailInput = document.getElementById('email');
const emailError = document.getElementById('email-error');

const githubInput = document.getElementById('github');
const githubError = document.getElementById('github-error');

const formScreen = document.getElementById('form-screen');
const ticketScreen = document.getElementById('ticket-screen');

let uploadedAvatarDataUrl = null; // holds the avatar image once validated

const MAX_FILE_SIZE = 500 * 1024; // 500KB, matches the hint text


// ===================== AVATAR UPLOAD =====================

// Click anywhere on the box opens the file picker
uploadBox.addEventListener('click', () => avatarInput.click());

// Keyboard support: Enter or Space also opens the file picker
uploadBox.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault(); // stop the page from scrolling on Space
    avatarInput.click();
  }
});

// Normal click-to-upload path
avatarInput.addEventListener('change', () => {
  const file = avatarInput.files[0];
  handleFile(file);
});

// Drag-and-drop path
uploadBox.addEventListener('dragover', (e) => {
  e.preventDefault(); // required, or the browser blocks the drop
  uploadBox.classList.add('drag-over');
});

uploadBox.addEventListener('dragleave', () => {
  uploadBox.classList.remove('drag-over');
});

uploadBox.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadBox.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  handleFile(file);
});

function handleFile(file) {
  if (!file) return;

  const validTypes = ['image/jpeg', 'image/png'];
  if (!validTypes.includes(file.type)) {
    showError(avatarError, 'Please upload a JPG or PNG image.');
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    showError(avatarError, 'File too large. Please upload an image under 500KB.');
    return;
  }

  clearError(avatarError);

  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedAvatarDataUrl = e.target.result;
    // Swap the instructions text for a live preview + remove option
    uploadBox.innerHTML = `
      <img src="${uploadedAvatarDataUrl}" alt="Avatar preview" class="preview" />
      <button type="button" id="remove-avatar">Remove image</button>
    `;
    document.getElementById('remove-avatar').addEventListener('click', (e) => {
      e.stopPropagation(); // don't let the click bubble up and reopen the file picker
      resetAvatar();
    });
  };
  reader.readAsDataURL(file);
}

function resetAvatar() {
  uploadedAvatarDataUrl = null;
  avatarInput.value = '';
  uploadBox.innerHTML = `<p id="upload-instructions">Drag and drop or click to upload</p>`;
}


// ===================== VALIDATION HELPERS =====================
function showError(errorEl, message) {
  errorEl.textContent = message;
  errorEl.hidden = false;
}

function clearError(errorEl) {
  errorEl.textContent = '';
  errorEl.hidden = true;
}

function isValidEmail(value) {
  // simple, good-enough pattern for a beginner project
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}


// ===================== FORM SUBMIT =====================
form.addEventListener('submit', (e) => {
  e.preventDefault(); // stop the page from reloading

  let isValid = true;

  // Avatar check
  if (!uploadedAvatarDataUrl) {
    showError(avatarError, 'Please upload an avatar image.');
    isValid = false;
  }

  // Full name check
  if (fullNameInput.value.trim() === '') {
    showError(fullNameError, 'Please enter your full name.');
    isValid = false;
  } else {
    clearError(fullNameError);
  }

  // Email check
  if (emailInput.value.trim() === '') {
    showError(emailError, 'Please enter your email address.');
    isValid = false;
  } else if (!isValidEmail(emailInput.value.trim())) {
    showError(emailError, 'Please enter a valid email address.');
    isValid = false;
  } else {
    clearError(emailError);
  }

  // GitHub username check
  if (githubInput.value.trim() === '') {
    showError(githubError, 'Please enter your GitHub username.');
    isValid = false;
  } else {
    clearError(githubError);
  }

  if (!isValid) return;

  generateTicket();
});


// ===================== TICKET GENERATION =====================
function generateTicket() {
  document.getElementById('ticket-name').textContent = fullNameInput.value.trim();
  document.getElementById('ticket-email').textContent = emailInput.value.trim();
  document.getElementById('ticket-fullname').textContent = fullNameInput.value.trim();

  const githubHandle = githubInput.value.trim().replace(/^@/, ''); // strip a leading @ if they typed one
  document.getElementById('ticket-github').textContent = `@${githubHandle}`;

  document.getElementById('ticket-avatar').src = uploadedAvatarDataUrl;
  document.getElementById('ticket-avatar').alt = `${fullNameInput.value.trim()}'s avatar`;

  const ticketNumber = String(Math.floor(Math.random() * 90000) + 10000);
  document.getElementById('ticket-number').textContent = `#${ticketNumber}`;

  formScreen.hidden = true;
  ticketScreen.hidden = false;
}
