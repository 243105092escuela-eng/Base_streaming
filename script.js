// script.js
async function cargarAnime() {
    // 1. Buscamos el archivo de datos
    const respuesta = await fetch('db.json');
    const datos = await respuesta.json();

    // 2. Seleccionamos el lugar donde queremos mostrar los videos
    const contenedor = document.getElementById('lista-anime');

    // 3. Recorremos los datos y creamos el HTML para cada anime
    datos.forEach(anime => {
        const tarjeta = `
            <div class="anime-card">
                <img src="${anime.poster}" alt="${anime.titulo}">
                <h3>${anime.titulo}</h3>
                <button onclick="reproducir('${anime.videoUrl}')">Ver ahora</button>
            </div>
        `;
        contenedor.innerHTML += tarjeta;
    });
}

// Ejecutar la función al cargar la página
cargarAnime();
