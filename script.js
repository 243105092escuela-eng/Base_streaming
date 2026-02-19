async function iniciarApp() {
    const catalogo = document.getElementById('anime-list');
    const status = document.getElementById('status');

    // Usamos el link RAW directo de tu GitHub para evitar errores de ruta
    const URL_DATABASE = "https://raw.githubusercontent.com/243105092escuela-eng/Base_streaming/main/db.json";

    try {
        const res = await fetch(URL_DATABASE);
        
        if (!res.ok) throw new Error("No se pudo conectar con la base de datos");

        const datos = await res.json();
        
        catalogo.innerHTML = ""; // Limpiamos el mensaje de carga

        datos.forEach(anime => {
            const card = document.createElement('div');
            card.className = 'anime-card';
            card.innerHTML = `
                <img src="${anime.poster}" onerror="this.src='https://via.placeholder.com/200x300?text=Error+Imagen'">
                <div class="card-info">
                    <strong>${anime.titulo}</strong><br>
                    <small>${anime.episodio}</small>
                </div>
            `;
            
            card.onclick = () => {
                // Forzamos que el link sea de EMBED
                let cleanUrl = anime.videoUrl.replace("watch?v=", "embed/");
                document.getElementById('video-player').src = cleanUrl;
                document.getElementById('current-title').innerText = anime.titulo;
                window.scrollTo({top: 0, behavior: 'smooth'});
            };
            
            catalogo.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        status.innerHTML = `<b style="color:red">Error de conexión:</b> Verifica que tu db.json sea público y tenga formato correcto.`;
    }
}
