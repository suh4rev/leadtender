/**
 * LEADTENDER — forms.js
 * Contact form validation, phone mask, and submission handling.
 * Works with forms having class `.contact-form`.
 * Vanilla JS ES6+. No dependencies.
 */

'use strict';

/* --------------------------------------------------------
   Validation helpers
   ------------------------------------------------------ */
const validators = {
  name(value) {
    const trimmed = value.trim();
    if (!trimmed) return 'Введите ваше имя';
    if (trimmed.length < 2) return 'Имя должно содержать минимум 2 символа';
    return '';
  },

  phone(value) {
    const digits = value.replace(/\D/g, '');
    if (!digits) return 'Введите номер телефона';
    if (!/^[78]/.test(digits)) return 'Номер должен начинаться с +7 или 8';
    if (digits.length !== 11) return 'Номер должен содержать 11 цифр';
    return '';
  },

  email(value) {
    const trimmed = value.trim();
    if (!trimmed) return 'Введите email';
    const emailRe = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRe.test(trimmed)) return 'Введите корректный email';
    return '';
  },

  privacy(checked) {
    if (!checked) return 'Необходимо согласие на обработку данных';
    return '';
  }
};

/* --------------------------------------------------------
   Phone mask
   ------------------------------------------------------ */
function applyPhoneMask(input) {
  input.addEventListener('focus', () => {
    if (!input.value) {
      input.value = '+7 ';
    }
  });

  input.addEventListener('input', () => {
    let digits = input.value.replace(/\D/g, '');

    // Normalise leading digit
    if (digits.startsWith('8')) {
      digits = '7' + digits.slice(1);
    }
    if (!digits.startsWith('7')) {
      digits = '7' + digits;
    }

    // Limit to 11 digits
    digits = digits.slice(0, 11);

    // Build formatted string
    let formatted = '+7';
    if (digits.length > 1) formatted += ' (' + digits.slice(1, 4);
    if (digits.length >= 4) formatted += ')';
    if (digits.length > 4) formatted += ' ' + digits.slice(4, 7);
    if (digits.length > 7) formatted += '-' + digits.slice(7, 9);
    if (digits.length > 9) formatted += '-' + digits.slice(9, 11);

    input.value = formatted;
  });

  // Allow only valid characters
  input.addEventListener('keypress', (e) => {
    const allowed = /[0-9\s()\-+]/;
    if (!allowed.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
      e.preventDefault();
    }
  });
}

/* --------------------------------------------------------
   Field error helpers
   ------------------------------------------------------ */
function showFieldError(field, message) {
  field.classList.add('error');

  let errorEl = field.parentElement.querySelector('.form-error');
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.className = 'form-error';
    field.parentElement.appendChild(errorEl);
  }
  errorEl.textContent = message;
}

function clearFieldError(field) {
  field.classList.remove('error');
  const errorEl = field.parentElement.querySelector('.form-error');
  if (errorEl) {
    errorEl.remove();
  }
}

/* --------------------------------------------------------
   Success state
   ------------------------------------------------------ */
function showSuccessState(form) {
  const successHTML = `
    <div class="form-success">
      <div class="form-success-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      <div class="form-success-text">Заявка отправлена!</div>
      <div class="form-success-sub">Мы свяжемся с вами в течение рабочего дня</div>
    </div>
  `;

  form.innerHTML = successHTML;
}

/* --------------------------------------------------------
   Validate entire form
   ------------------------------------------------------ */
function validateForm(form) {
  let isValid = true;

  // Name
  const nameField = form.querySelector('input[name="name"]');
  if (nameField) {
    const error = validators.name(nameField.value);
    if (error) {
      showFieldError(nameField, error);
      isValid = false;
    } else {
      clearFieldError(nameField);
    }
  }

  // Phone
  const phoneField = form.querySelector('input[name="phone"]');
  if (phoneField) {
    const error = validators.phone(phoneField.value);
    if (error) {
      showFieldError(phoneField, error);
      isValid = false;
    } else {
      clearFieldError(phoneField);
    }
  }

  // Email
  const emailField = form.querySelector('input[name="email"]');
  if (emailField) {
    const error = validators.email(emailField.value);
    if (error) {
      showFieldError(emailField, error);
      isValid = false;
    } else {
      clearFieldError(emailField);
    }
  }

  // Privacy checkbox
  const privacyField = form.querySelector('input[name="privacy"]');
  if (privacyField) {
    const error = validators.privacy(privacyField.checked);
    if (error) {
      showFieldError(privacyField, error);
      isValid = false;
    } else {
      clearFieldError(privacyField);
    }
  }

  return isValid;
}

/* --------------------------------------------------------
   Init single form
   ------------------------------------------------------ */
function initContactForm(form) {
  // Setup phone mask
  const phoneField = form.querySelector('input[name="phone"]');
  if (phoneField) {
    applyPhoneMask(phoneField);
  }

  // Remove error on input
  const fields = form.querySelectorAll('input, textarea');
  fields.forEach((field) => {
    const eventName = field.type === 'checkbox' ? 'change' : 'input';
    field.addEventListener(eventName, () => {
      clearFieldError(field);
    });
  });

  // Submit handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (validateForm(form)) {
      showSuccessState(form);
    }
  });
}

/* --------------------------------------------------------
   Init
   ------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.contact-form').forEach(initContactForm);
});
