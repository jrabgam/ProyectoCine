document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("carouselContainer");
  try {
    const res = await fetch("http://localhost:3000/api/funciones");
    const funciones = await res.json();

    if (!Array.isArray(funciones) || funciones.length === 0) {
      contenedor.innerHTML = "<p class='text-white text-center'>No hay funciones disponibles.</p>";
      return;
    }
    const carouselId = "carouselFunciones";
    let indicadores = "";
    let items = "";

    funciones.forEach((funcion, index) => {
      indicadores += `
        <button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${index}"
          class="${index === 0 ? 'active' : ''}" 
          ${index === 0 ? 'aria-current="true"' : ''}
          aria-label="Slide ${index + 1}">
        </button>
      `;

      items += `
        <div class="carousel-item ${index === 0 ? 'active' : ''}" data-bs-interval="5000">
          <img src="http://localhost:3000/uploads/${funcion.imagen_url}" 
               class="d-block w-100" 
               alt="${funcion.titulo}" 
               style="height: 400px; object-fit: cover;">
          <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
            <h5>${funcion.titulo}</h5>
            <p><strong>Clasificación:</strong> ${funcion.clasificacion}</p>
            <p><strong>Duración:</strong> ${funcion.duracion} min</p>
            <p><strong>Sala:</strong> ${funcion.nombre_sala} (${funcion.filas}x${funcion.columnas})</p>
            <p><strong>Fecha:</strong> ${new Date(funcion.fecha).toLocaleString()}</p>
            <a href="reservar.html?id=${funcion.id}" class="btn btn-primary mt-2">Reservar película</a>
          </div>
        </div>
      `;
    });

    contenedor.innerHTML = `
      <div id="${carouselId}" class="carousel carousel-dark slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
          ${indicadores}
        </div>
        <div class="carousel-inner">
          ${items}
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Anterior</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Siguiente</span>
        </button>
      </div>
    `;
  } catch (error) {
    console.error("Error al cargar funciones:", error);
    contenedor.innerHTML = "<p class='text-danger text-center'>Error al cargar funciones.</p>";
  }
});
