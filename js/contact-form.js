(function () {
  const CONTACT_EMAIL = 'quimirocio@hotmail.com';
  const ENDPOINT = 'https://formsubmit.co/ajax/' + CONTACT_EMAIL;

  // Pega aqui la URL de tu Google Apps Script (termina en /exec) para guardar
  // cada contacto tambien en una hoja de Google Sheets. Ver google-apps-script.gs
  // para las instrucciones de configuracion. Mientras quede vacio, este paso se omite.
  const SHEETS_ENDPOINT = '';

  const form = document.getElementById('contactForm');
  const status = document.getElementById('contactFormStatus');
  if (!form || !status) return;

  const submitBtn = form.querySelector('.contact-form__submit');
  const submitLabel = form.querySelector('.contact-form__submit-label');

  function setStatus(message, type) {
    status.textContent = message;
    status.className = 'contact-form__status contact-form__status--' + type;
  }

  function logToSheet(formData) {
    if (!SHEETS_ENDPOINT) return;
    const data = {};
    formData.forEach(function (value, key) {
      if (key.indexOf('_') !== 0) data[key] = value;
    });
    fetch(SHEETS_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data)
    }).catch(function () {});
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (form.querySelector('[name="_honey"]').value) {
      return;
    }

    submitBtn.disabled = true;
    submitLabel.textContent = 'Enviando…';
    setStatus('', '');

    const formData = new FormData(form);
    logToSheet(formData);

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData
    })
      .then(function (res) {
        if (!res.ok) throw new Error('bad response');
        return res.json();
      })
      .then(function () {
        setStatus('¡Gracias! Tu mensaje fue enviado, Rocío te escribirá pronto. 💌', 'success');
        form.reset();
      })
      .catch(function () {
        setStatus(
          'No se pudo enviar el mensaje. Por favor intenta de nuevo o escríbenos directo por WhatsApp o correo.',
          'error'
        );
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitLabel.textContent = 'Enviar mensaje';
      });
  });
})();
