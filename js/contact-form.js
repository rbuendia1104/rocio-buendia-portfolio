(function () {
  // Pega aqui la URL de tu Google Apps Script (termina en /exec).
  // Ver google-apps-script.gs para las instrucciones de configuracion.
  // Mientras quede vacio, el formulario avisa que aun no esta conectado.
  const ENDPOINT = '';

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

    if (!ENDPOINT) {
      setStatus(
        'El formulario aún no está conectado. Mientras tanto, escríbenos directo por WhatsApp o correo.',
        'error'
      );
      return;
    }

    submitBtn.disabled = true;
    submitLabel.textContent = 'Enviando…';
    setStatus('', '');

    const data = {
      Nombre: form.querySelector('#cfName').value,
      Correo: form.querySelector('#cfEmail').value,
      Telefono: form.querySelector('#cfPhone').value,
      Mensaje: form.querySelector('#cfMessage').value
    };

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data)
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
