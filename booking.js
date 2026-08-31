document.addEventListener('DOMContentLoaded', function () {
  var FORMSPREE_ENDPOINT = 'https://formspree.io/f/mbgjdgrp';

  var form = document.getElementById('booking-form');
  var formView = document.getElementById('form-view');
  var successView = document.getElementById('success-view');
  var contactHint = document.getElementById('contact-hint');
  var contactError = document.getElementById('contact-error');
  var sendError = document.getElementById('send-error');
  var resetBtn = document.getElementById('reset-btn');
  var submitBtn = document.getElementById('submit-btn');

  function showContactError() {
    contactHint.style.display = 'none';
    contactError.style.display = 'flex';
  }
  function clearContactError() {
    contactHint.style.display = 'block';
    contactError.style.display = 'none';
  }
  function showSendError() {
    if (sendError) sendError.style.display = 'flex';
  }
  function clearSendError() {
    if (sendError) sendError.style.display = 'none';
  }
  function setSending(isSending) {
    if (!submitBtn) return;
    submitBtn.disabled = isSending;
    submitBtn.textContent = isSending ? 'Sending…' : 'Send request';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = new FormData(form);
    var g = function (k) { return (f.get(k) || '').toString().trim(); };

    // honeypot: if this hidden field got filled in, it's a bot -- silently pretend success
    if (g('_gotcha')) {
      formView.style.display = 'none';
      successView.style.display = 'block';
      return;
    }

    if (!g('phone') && !g('email')) {
      showContactError();
      var phoneEl = document.getElementById('bk-phone');
      if (phoneEl) phoneEl.focus();
      return;
    }
    clearContactError();
    clearSendError();

    var subject = 'Service request — ' + (g('service') || 'Piano service') +
      ' — ' + (g('name') || 'Website') + (g('city') ? ', ' + g('city') : '');
    f.set('_subject', subject);

    setSending(true);

    fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: f,
      headers: { 'Accept': 'application/json' }
    }).then(function (response) {
      if (response.ok) {
        formView.style.display = 'none';
        successView.style.display = 'block';
      } else {
        showSendError();
      }
    }).catch(function () {
      showSendError();
    }).then(function () {
      setSending(false);
    });
  });

  resetBtn.addEventListener('click', function () {
    form.reset();
    clearContactError();
    clearSendError();
    successView.style.display = 'none';
    formView.style.display = 'block';
  });
});
