/* ============================================
   TheTastyFood — Contact Page JS
   ============================================ */
(function () {
  'use strict';

  /* ---------- DOM References ---------- */
  var form = document.getElementById('contactForm');
  var modal = document.getElementById('successModal');
  var modalClose = document.getElementById('modalClose');

  /* ---------- Validation helpers ---------- */
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(group) {
    group.classList.add('error');
  }

  function clearError(group) {
    group.classList.remove('error');
  }

  function validateField(input) {
    var group = input.closest('.form-group');
    if (!input.value || input.value.trim() === '') {
      setError(group);
      return false;
    }
    clearError(group);
    return true;
  }

  function validateEmail(input) {
    var group = input.closest('.form-group');
    if (!input.value || !emailRegex.test(input.value.trim())) {
      setError(group);
      return false;
    }
    clearError(group);
    return true;
  }

  /* ---------- Clear errors on input ---------- */
  var inputs = form.querySelectorAll('.form-input');
  inputs.forEach(function (input) {
    input.addEventListener('input', function () {
      clearError(input.closest('.form-group'));
    });
  });

  /* ---------- Form submit ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var nameInput = document.getElementById('ctName');
    var emailInput = document.getElementById('ctEmail');
    var subjectInput = document.getElementById('ctSubject');
    var messageInput = document.getElementById('ctMessage');

    var isValid = true;

    if (!validateField(nameInput)) isValid = false;
    if (!validateEmail(emailInput)) isValid = false;
    if (!validateField(subjectInput)) isValid = false;
    if (!validateField(messageInput)) isValid = false;

    if (!isValid) return;

    /* Show success modal */
    document.getElementById('modalDetails').textContent =
      'Thank you, ' + nameInput.value.trim() + '! We\'ve received your message and will get back to you within 24 hours.';

    modal.classList.add('active');
  });

  /* ---------- Modal close ---------- */
  modalClose.addEventListener('click', function () {
    modal.classList.remove('active');
    form.reset();
    /* Clear all error states */
    var groups = form.querySelectorAll('.form-group');
    groups.forEach(function (g) {
      g.classList.remove('error');
    });
  });

  /* Close modal on backdrop click */
  modal.addEventListener('click', function (e) {
    if (e.target === modal) {
      modalClose.click();
    }
  });
})();
