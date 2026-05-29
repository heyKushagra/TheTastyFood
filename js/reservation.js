/* ============================================
   TheTastyFood — Reservation Page JS
   ============================================ */
(function () {
  'use strict';

  /* ---------- DOM References ---------- */
  var form = document.getElementById('reservationForm');
  var dateInput = document.getElementById('resDate');
  var modal = document.getElementById('successModal');
  var modalDetails = document.getElementById('modalDetails');
  var modalClose = document.getElementById('modalClose');

  /* ---------- Set min date to today ---------- */
  function setMinDate() {
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var dd = String(today.getDate()).padStart(2, '0');
    dateInput.setAttribute('min', yyyy + '-' + mm + '-' + dd);
  }
  setMinDate();

  /* ---------- Validation helpers ---------- */
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

  /* ---------- Clear errors on input ---------- */
  var inputs = form.querySelectorAll('.form-input');
  inputs.forEach(function (input) {
    input.addEventListener('input', function () {
      clearError(input.closest('.form-group'));
    });
    input.addEventListener('change', function () {
      clearError(input.closest('.form-group'));
    });
  });

  /* ---------- Form submit ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var nameInput = document.getElementById('resName');
    var phoneInput = document.getElementById('resPhone');
    var timeInput = document.getElementById('resTime');
    var guestsInput = document.getElementById('resGuests');

    var isValid = true;

    if (!validateField(nameInput)) isValid = false;
    if (!validateField(phoneInput)) isValid = false;
    if (!validateField(dateInput)) isValid = false;
    if (!validateField(timeInput)) isValid = false;
    if (!validateField(guestsInput)) isValid = false;

    if (!isValid) return;

    /* Build reservation object */
    var reservation = {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      date: dateInput.value,
      time: timeInput.value,
      guests: guestsInput.value,
      createdAt: new Date().toISOString()
    };

    /* Save to localStorage */
    var existing = [];
    try {
      var stored = localStorage.getItem('ttf_reservations');
      if (stored) existing = JSON.parse(stored);
    } catch (err) {
      existing = [];
    }
    existing.push(reservation);
    localStorage.setItem('ttf_reservations', JSON.stringify(existing));

    /* Format date for display */
    var dateObj = new Date(reservation.date + 'T00:00:00');
    var formattedDate = dateObj.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    /* Show modal */
    modalDetails.innerHTML =
      '<strong>' + reservation.name + '</strong><br>' +
      formattedDate + ' at ' + reservation.time + '<br>' +
      reservation.guests;

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
