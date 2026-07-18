(function () {
  const CONTACT_EMAIL = 'quimirocio@hotmail.com';
  const ENDPOINT = 'https://formsubmit.co/ajax/' + CONTACT_EMAIL;

  const form = document.getElementById('contactForm');
  const status = document.getElementById('contactFormStatus');
  if (!form || !status) return;

  const submitBtn = form.querySelector('.contact-form__submit');
  const submitLabel = form.querySelector('.contact-form__submit-label');

  function setStatus(message, type) {
    status.textContent = message;
    status.className = 'contact-form__status contact-form__status--' + type;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (form.querySelector('[name="_honey"]').value) {
      return;
    }

    submitBtn.disabled = true;
    submitLabel.textContent = 'Enviando…';
    setStatus('', '');

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form)
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
