/* ============================================
   TheTastyFood — Contact Page JS
   ============================================ */
(function () {
  'use strict';

  /* ---------- EmailJS Configuration ---------- */
  // TODO: Replace these with your actual EmailJS credentials
  var EMAILJS_PUBLIC_KEY = "tuT5xMERUOqJ8u4Kw";     // Found in Account > API Keys
  var EMAILJS_SERVICE_ID = "service_knpbdo5";     // Found in Email Services
  var EMAILJS_TEMPLATE_ID = "template_ql9iit8";   // Found in Email Templates

  /* Initialize EmailJS if configured */
  if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.init({
      publicKey: EMAILJS_PUBLIC_KEY,
    });
  }

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

    var submitBtn = form.querySelector('button[type="submit"]');
    var originalBtnHtml = submitBtn.innerHTML;

    // Visual loading state
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.innerHTML = 'Sending Message...';

    var templateParams = {
      from_name: nameInput.value.trim(),
      from_email: emailInput.value.trim(),
      subject: subjectInput.value.trim(),
      message: messageInput.value.trim()
    };

    // Safety check: verify if EmailJS SDK is loaded
    if (typeof emailjs === 'undefined') {
      console.error("EmailJS SDK is not loaded. Check script tag in contact.html or ad-blockers.");
      alert('Failed to send message: EmailJS library could not be loaded. Please check your internet connection or disable ad-blockers.');
      submitBtn.disabled = false;
      submitBtn.style.opacity = '';
      submitBtn.innerHTML = originalBtnHtml;
      return;
    }

    // If EmailJS credentials are not set yet, run in Demo Mode for portfolio showcase
    if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY' || EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' || EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID') {
      console.warn("EmailJS is not fully configured. Running in Demo Mode (simulating successful send).");
      setTimeout(function () {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
        submitBtn.innerHTML = originalBtnHtml;

        document.getElementById('modalDetails').textContent =
          'Thank you, ' + nameInput.value.trim() + '! We\'ve received your message (Demo Mode) and will get back to you within 24 hours.';
        modal.classList.add('active');
      }, 1200);
      return;
    }

    try {
      // Actual EmailJS send request
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(function () {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '';
          submitBtn.innerHTML = originalBtnHtml;

          document.getElementById('modalDetails').textContent =
            'Thank you, ' + nameInput.value.trim() + '! Your message has been sent successfully. We\'ll get back to you within 24 hours.';
          modal.classList.add('active');
        }, function (error) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '';
          submitBtn.innerHTML = originalBtnHtml;
          
          console.error("EmailJS Error: ", error);
          alert('Failed to send the message. Please check console for details or configure your EmailJS API keys.');
        });
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '';
      submitBtn.innerHTML = originalBtnHtml;
      console.error("EmailJS Send Exec Error: ", err);
      alert('An unexpected error occurred while sending. Please check your browser console.');
    }
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
