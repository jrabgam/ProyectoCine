document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const funcionId = urlParams.get('id');

  if (!funcionId) {
    alert('No se encontró el ID de la función.');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/funciones/${funcionId}/sala`);
    const data = await response.json();

    const filas = data.filas;
    const columnas = data.columnas;

    generarButacas(filas, columnas);
  } catch (error) {
    console.error('Error al obtener datos de la sala:', error);
  }
});

let butacasSeleccionadas = [];

function generarButacas(filas, columnas) {
  const contenedor = document.getElementById('butacas-container');
  contenedor.innerHTML = '';

  for (let fila = 0; fila < filas; fila++) {
    const filaDiv = document.createElement('div');
    filaDiv.classList.add('fila');

    for (let col = 0; col < columnas; col++) {
      const butaca = document.createElement('div');
      butaca.classList.add('butaca');
      butaca.dataset.fila = fila;
      butaca.dataset.columna = col;
      butaca.textContent = `${String.fromCharCode(65 + fila)}${col + 1}`;
      butaca.addEventListener('click', () => {
        if (!butaca.classList.contains('ocupada')) {
          document.querySelectorAll('.butaca.seleccionada').forEach(b => b.classList.remove('seleccionada'));
          butaca.classList.add('seleccionada');
        }
      });

      filaDiv.appendChild(butaca);
    }

    contenedor.appendChild(filaDiv);
  }
}

document.getElementById('btnReservar').addEventListener('click', () => {
  const seleccionada = document.querySelector('.butaca.seleccionada');

  if (!seleccionada) {
    alert('Selecciona una butaca primero.');
    return;
  }

  butacasSeleccionadas = [seleccionada];

  const modal = new bootstrap.Modal(document.getElementById('modalReserva'));
  modal.show();
});

document.getElementById('confirmarReserva').addEventListener('click', () => {
  const nombre = document.getElementById('nombre').value.trim();
  const apellido = document.getElementById('apellido').value.trim();
  const nit = document.getElementById('nit').value.trim();

  if (!nombre || !apellido || !nit) {
    alert('Por favor completa todos los campos.');
    return;
  }
  butacasSeleccionadas.forEach(butaca => {
    butaca.classList.remove('seleccionada');
    butaca.classList.add('ocupada');
  });

  document.getElementById('formReserva').reset();

  const modal = bootstrap.Modal.getInstance(document.getElementById('modalReserva'));
  modal.hide();

  const toast = new bootstrap.Toast(document.getElementById('mensajeReserva'));
  toast.show();
});
