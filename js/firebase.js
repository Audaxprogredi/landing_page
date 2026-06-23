document.addEventListener('DOMContentLoaded', () => {
  
  // URLs de Firebase (Nodos separados para mantener orden)
  const baseDB = "https://landing-ce40b-default-rtdb.firebaseio.com";
  const suscripcionesUrl = `${baseDB}/suscriptores.json`;
  const ratingsUrl = `${baseDB}/ratings.json`;

  // ==========================================
  // LÓGICA 1: NEWSLETTER (Con FETCH)
  // ==========================================
  const form = document.getElementById('form-newsletter');
  const emailInput = document.getElementById('infoenviar');
  const temaSelect = document.getElementById('tema-select');
  const contadorText = document.getElementById('contador-suscritos');

  const obtenerSuscriptores = async () => {
    try {
      const res = await fetch(suscripcionesUrl);
      const data = await res.json();
      const total = data ? Object.keys(data).length : 0;
      if (contadorText) contadorText.textContent = `${total} persona${total !== 1 ? 's' : ''} suscrita${total !== 1 ? 's' : ''}`;
    } catch (e) { console.error("Error GET Newsletter:", e); }
  };

  obtenerSuscriptores(); // Cargar al inicio

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); 
      const email = emailInput.value.trim();
      const tema = temaSelect.value;

      if (email) {
        try {
          await fetch(suscripcionesUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, tema, fecha: new Date().toISOString() })
          });
          emailInput.value = '';
          alert('¡Gracias por suscribirte!');
          obtenerSuscriptores(); // Actualizar contador
        } catch (e) { alert('Error al suscribirse.'); }
      }
    });
  }

  // ==========================================
  // LÓGICA 2: ESTRELLAS Y PROGRESO (Con FETCH)
  // ==========================================
  const stars = document.querySelectorAll('.star');
  const ratingText = document.getElementById('rating-text');
  const promedioTexto = document.getElementById('promedio-texto');
  const barraProgreso = document.getElementById('barra-progreso');
  const totalVotosTexto = document.getElementById('total-votos');
  
  const messages = ['¡Necesita mejorar! 💔', 'Puede ser mejor 🤔', '¡Está bien! 🎧', '¡Me gusta mucho! 🔥', '¡Es increíble! 🚀'];
  let currentRating = 0;
  let haVotado = false; // Bloquea múltiples votos seguidos

  // Función para pintar la barra de estadísticas
  const obtenerEstadisticas = async () => {
    try {
      const res = await fetch(ratingsUrl);
      const data = await res.json();
      
      if (data) {
        // Convertimos los datos de Firebase en un array fácil de sumar
        const votos = Object.values(data);
        const totalVotos = votos.length;
        
        // Sumar todas las calificaciones
        const sumaTotal = votos.reduce((acumulador, voto) => acumulador + voto.calificacion, 0);
        
        // Calcular promedio a 1 decimal
        const promedio = (sumaTotal / totalVotos).toFixed(1);
        
        // Actualizar la Interfaz Web
        promedioTexto.innerHTML = `${promedio}<span class="text-sm text-gray-400">/5</span>`;
        // Calcular porcentaje para el width de la barra de CSS
        barraProgreso.style.width = `${(promedio / 5) * 100}%`;
        totalVotosTexto.innerText = `${totalVotos} opinión${totalVotos !== 1 ? 'es' : ''} en total`;
      }
    } catch (e) { console.error("Error GET Estrellas:", e); }
  };

  obtenerEstadisticas(); // Cargar al inicio

  // Función visual de las estrellas
  const updateStars = (rating) => {
    stars.forEach((star) => {
      const value = parseInt(star.getAttribute('data-value'));
      if (value <= rating) {
        star.classList.remove('text-[var(--muted)]');
        star.classList.add('text-mint', 'drop-shadow-[0_0_12px_rgba(45,212,168,0.6)]');
      } else {
        star.classList.add('text-[var(--muted)]');
        star.classList.remove('text-mint', 'drop-shadow-[0_0_12px_rgba(45,212,168,0.6)]');
      }
    });
  };

  // Eventos de los botones de estrella
  stars.forEach((star) => {
    star.addEventListener('mouseover', function() { if (!haVotado) updateStars(parseInt(this.getAttribute('data-value'))); });
    star.addEventListener('mouseout', function() { if (!haVotado) updateStars(currentRating); });
    
    star.addEventListener('click', async function() {
      if (haVotado) {
        alert("¡Ya registramos tu calificación, gracias!");
        return;
      }

      currentRating = parseInt(this.getAttribute('data-value'));
      updateStars(currentRating);
      ratingText.innerText = messages[currentRating - 1];
      haVotado = true; // Bloqueamos para que no hagan spam

      try {
        // Guardar voto en Firebase
        await fetch(ratingsUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ calificacion: currentRating, fecha: new Date().toISOString() })
        });
        
        // Volver a calcular el progreso con el nuevo voto
        obtenerEstadisticas();
      } catch (error) {
        console.error('Error al guardar estrella:', error);
      }
    });
  });

});