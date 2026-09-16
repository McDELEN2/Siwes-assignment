// Contact form validation

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.contact-form form');

  const firstNameInput = document.getElementById('first-name');
  const lastNameInput = document.getElementById('last-name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const consentInput = document.getElementById('consent');
  const queryRadios = document.querySelectorAll('input[name="query-type"]');

  // Build an error <span> under a field the first time it's needed
  function getErrorEl(input, container) {
    const target = container || input.closest('.form-group');
    let errorEl = target.querySelector('.error-message');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'error-message';
      target.appendChild(errorEl);
    }
    return errorEl;
  }

  function showError(input, message, container) {
    const target = container || input.closest('.form-group');
    const errorEl = getErrorEl(input, target);
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    if (input) input.classList.add('input-error');
    target.classList.add('has-error');
  }

  function clearError(input, container) {
    const target = container || input.closest('.form-group');
    const errorEl = target.querySelector('.error-message');
    if (errorEl) errorEl.style.display = 'none';
    if (input) input.classList.remove('input-error');
    target.classList.remove('has-error');
  }

  function isValidEmail(value) {
    // Simple, permissive email pattern
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validateRequiredText(input) {
    const value = input.value.trim();
    if (value === '') {
      showError(input, 'This field is required');
      return false;
    }
    clearError(input);
    return true;
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    if (value === '') {
      showError(emailInput, 'This field is required');
      return false;
    }
    if (!isValidEmail(value)) {
      showError(emailInput, 'Please enter a valid email address');
      return false;
    }
    clearError(emailInput);
    return true;
  }

  function validateQueryType() {
    const container = document.querySelector('.query-options').closest('.form-group');
    const checked = Array.from(queryRadios).some(radio => radio.checked);
    if (!checked) {
      showError(null, 'Please select a query type', container);
      return false;
    }
    clearError(null, container);
    return true;
  }

  function validateMessage() {
    return validateRequiredText(messageInput);
  }

  function validateConsent() {
    const container = consentInput.closest('.form-group');
    if (!consentInput.checked) {
      showError(consentInput, 'To submit this form, please consent to being contacted', container);
      return false;
    }
    clearError(consentInput, container);
    return true;
  }

  function showSuccessMessage() {
    let toast = document.querySelector('.success-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'success-toast';
      toast.innerHTML = `
        <strong>Message Sent!</strong>
        <p>Thanks for reaching out. We'll get back to you as soon as possible.</p>
      `;
      document.body.appendChild(toast);
    }
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  // Validate on blur for quicker feedback
  firstNameInput.addEventListener('blur', () => validateRequiredText(firstNameInput));
  lastNameInput.addEventListener('blur', () => validateRequiredText(lastNameInput));
  emailInput.addEventListener('blur', validateEmail);
  messageInput.addEventListener('blur', validateMessage);
  queryRadios.forEach(radio => radio.addEventListener('change', validateQueryType));
  consentInput.addEventListener('change', validateConsent);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const validations = [
      validateRequiredText(firstNameInput),
      validateRequiredText(lastNameInput),
      validateEmail(),
      validateQueryType(),
      validateMessage(),
      validateConsent()
    ];

    const isFormValid = validations.every(Boolean);

    if (isFormValid) {
      showSuccessMessage();
      form.reset();
      // Clear any lingering error states after reset
      [firstNameInput, lastNameInput, emailInput, messageInput, consentInput].forEach(input => clearError(input));
      clearError(null, document.querySelector('.query-options').closest('.form-group'));
    }
  });
});
