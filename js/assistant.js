(function () {
  const KB = [
    {
      keywords: ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'saludos'],
      answer: '¡Hola de nuevo! 👋 Soy Rochi. Puedo contarte sobre los servicios de Rocío, su experiencia, dónde está o cómo escribirle. ¿Qué te gustaría saber? 😊'
    },
    {
      keywords: ['servicio', 'servicios', 'producto', 'productos', 'ofreces', 'ofrecen', 'que haces', 'a que te dedicas', 'que hace'],
      answer: '¡Con gusto te cuento! 🌿 Rocío ofrece tres líneas de trabajo: 📦 <b>productos ambientales</b> (sistemas modulares de tratamiento y monitoreo remoto), 🌱 <b>servicios y proyectos</b> (diagnóstico, diseño e implementación de soluciones ambientales) y 🤝 <b>asesoría en liderazgo</b>. Puedes ver el detalle en la sección "Servicios" más arriba, o escribirle directo por <a href="https://wa.me/51940198474" target="_blank" rel="noopener">WhatsApp</a> 💬.'
    },
    {
      keywords: ['asesoria', 'asesoría', 'liderazgo', 'mentoria', 'mentoría', 'coaching', 'equipo', 'equipos', 'formacion', 'formación'],
      answer: '¡Me encanta esa pregunta! 🤝 Rocío ofrece asesoría y acompañamiento a personas y equipos para fortalecer el liderazgo y convertir ideas en resultados. Puedes agendar una asesoría desde la sección "Servicios" o escribir directo por <a href="https://wa.me/51940198474?text=Hola%20Roc%C3%ADo%2C%20quisiera%20agendar%20una%20asesor%C3%ADa." target="_blank" rel="noopener">WhatsApp</a> ✨.'
    },
    {
      keywords: ['contacto', 'contactar', 'whatsapp', 'telefono', 'teléfono', 'numero', 'número', 'correo', 'email', 'mail', 'escribir', 'comunicarme'],
      answer: '¡Claro que sí! 📱 Puedes escribirle por <a href="https://wa.me/51940198474" target="_blank" rel="noopener">WhatsApp al +51 940 198 474</a> o al correo <a href="mailto:quimirocio@hotmail.com">quimirocio@hotmail.com</a> ✉️. También hay botones directos en la sección "Servicios" y "Conversemos".'
    },
    {
      keywords: ['ubicacion', 'ubicación', 'donde', 'dónde', 'ciudad', 'pais', 'país', 'lima', 'peru', 'perú', 'vives', 'trabaja'],
      answer: '📍 Rocío está en Lima, Perú, aunque le encanta viajar y trabajar en proyectos de distintas regiones.'
    },
    {
      keywords: ['experiencia', 'anos', 'años', 'cuanto tiempo', 'cuánto tiempo', 'trayectoria', 'hace cuanto'],
      answer: '🌟 Tiene más de <b>17 años de experiencia</b> en proyectos, obras, servicios y suministros para los sectores minero, industrial, petrolero y ambiental. ¡Un montón de historias que contar!'
    },
    {
      keywords: ['sector', 'sectores', 'industria', 'mineria', 'minería', 'petrolero', 'petroleo', 'petróleo'],
      answer: '🏭 Ha trabajado en los sectores <b>minero, industrial, petrolero y ambiental</b>, siempre con foco en soluciones de agua y medio ambiente.'
    },
    {
      keywords: ['profesion', 'profesión', 'estudios', 'ingeniera', 'quimica', 'química', 'quien es', 'quién es', 'quien eres'],
      answer: '👩‍🔬 Rocío es <b>ingeniera química</b> y lidera proyectos, productos y servicios ambientales, combinando conocimiento técnico con un liderazgo cercano y humano.'
    },
    {
      keywords: ['foto', 'fotos', 'galeria', 'galería', 'proyectos', 'video', 'imagen', 'imagenes', 'imágenes'],
      answer: '📸🎥 En la sección "Galería" puedes ver fotos y un video reales de sus proyectos en campo: muestreo, plantas de tratamiento, minería y más. ¡Vale la pena verlas!'
    },
    {
      keywords: ['gracias', 'genial', 'perfecto', 'excelente'],
      answer: '¡De nadaaa! 💛 Fue un gusto ayudarte. Si tienes otra pregunta, aquí sigo. Y si prefieres hablar directo con Rocío, escríbele por <a href="https://wa.me/51940198474" target="_blank" rel="noopener">WhatsApp</a> 🙌.'
    },
    {
      keywords: ['quien eres tu', 'quien es rochi', 'que eres', 'eres un bot', 'eres una persona', 'como te llamas'],
      answer: '¡Soy Rochi! 🌿 Un pequeño asistente virtual creado para ayudarte a conocer más sobre el trabajo de Rocío mientras exploras esta página. No soy Rocío, pero con gusto te oriento en lo que necesites 😊.'
    }
  ];

  const FALLBACK = 'Mmm, esa no la tengo tan clara todavía 🤔 pero no te preocupes: escríbele directo a Rocío por <a href="https://wa.me/51940198474" target="_blank" rel="noopener">WhatsApp</a> o al correo <a href="mailto:quimirocio@hotmail.com">quimirocio@hotmail.com</a> y ella te responderá personalmente 💬.';

  const GREETING = '¡Hola! Soy Rochi 🌿, el asistente virtual de esta página. Estoy aquí para ayudarte con lo que necesites saber sobre Rocío y su trabajo. ¿En qué te ayudo hoy? 😊';

  const QUICK_REPLIES = ['Servicios', 'Experiencia', 'Ubicación', 'Contacto'];

  function stripAccents(str) {
    var combiningMarks = new RegExp(String.fromCharCode(91) + String.fromCharCode(92) + 'u0300-' + String.fromCharCode(92) + 'u036f' + String.fromCharCode(93), 'g');
    return str.normalize('NFD').replace(combiningMarks, '');
  }

  function normalize(str) {
    return stripAccents(str.toLowerCase().trim());
  }

  function findAnswer(text) {
    const q = normalize(text);
    let best = null;
    let bestScore = 0;
    KB.forEach((entry) => {
      let score = 0;
      entry.keywords.forEach((kw) => {
        if (q.includes(normalize(kw))) score += kw.length;
      });
      if (score > bestScore) {
        bestScore = score;
        best = entry;
      }
    });
    return best ? best.answer : FALLBACK;
  }

  const root = document.getElementById('assistant');
  const toggle = document.getElementById('assistantToggle');
  const closeBtn = document.getElementById('assistantClose');
  const panel = document.getElementById('assistantPanel');
  const messagesEl = document.getElementById('assistantMessages');
  const chipsEl = document.getElementById('assistantChips');
  const form = document.getElementById('assistantForm');
  const input = document.getElementById('assistantInput');

  if (!root) return;

  function addMessage(text, who) {
    const msg = document.createElement('div');
    msg.className = 'assistant__msg assistant__msg--' + who;
    msg.innerHTML = text;
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function renderChips() {
    chipsEl.innerHTML = '';
    QUICK_REPLIES.forEach((label) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'assistant__chip';
      chip.textContent = label;
      chip.addEventListener('click', () => handleUserMessage(label));
      chipsEl.appendChild(chip);
    });
  }

  function handleUserMessage(text) {
    if (!text.trim()) return;
    addMessage(text, 'user');
    input.value = '';
    window.setTimeout(() => {
      addMessage(findAnswer(text), 'bot');
    }, 300);
  }

  let started = false;
  function openAssistant() {
    root.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
    if (!started) {
      started = true;
      addMessage(GREETING, 'bot');
      renderChips();
    }
    input.focus();
  }

  function closeAssistant() {
    root.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
  }

  toggle.addEventListener('click', () => {
    if (root.classList.contains('is-open')) closeAssistant();
    else openAssistant();
  });
  closeBtn.addEventListener('click', closeAssistant);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleUserMessage(input.value);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.classList.contains('is-open')) closeAssistant();
  });
})();
