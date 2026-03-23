// ============================================================
//  BEATFLOW — script.js
//  Backend: Supabase (REST API + Realtime)
// ============================================================


// --- 0. CONFIGURACIÓN SUPABASE ---

const SUPABASE_URL = 'https://nzzabdtnixfwbtjuwlnp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56emFiZHRuaXhmd2J0anV3bG5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODM3NDAsImV4cCI6MjA4OTg1OTc0MH0.ELsa3rj4YyS7pwVECYGrB7pviDwkRe3WsNSqqv9P70k';


// ============================================================
// --- 1. LÓGICA DE USUARIOS Y REGISTRO ---
// ============================================================

async function registrarUsuario() {
    const nombreInput = document.getElementById('user-input');
    const nombre = nombreInput.value.trim();

    if (!nombre) {
        alert("Por favor, ingresa un nombre para continuar.");
        return;
    }

    // Verificar si el nombre ya existe antes de insertar
    const usuarios = await obtenerUsuarios();
    if (!usuarios.includes(nombre)) {
        const ok = await insertarUsuario(nombre);
        if (!ok) {
            alert("Hubo un error al registrarte. Intenta de nuevo.");
            return;
        }
    }

    // Guardar sesión local
    localStorage.setItem('beatflow_current_user', nombre);
    mostrarInterfazUsuario(nombre);
    await actualizarListaPublica();
}

function mostrarInterfazUsuario(nombre) {
    const modal       = document.getElementById('register-modal');
    const userCard    = document.getElementById('user-card');
    const displayName = document.getElementById('display-name');

    if (modal)        modal.style.display = 'none';
    if (userCard)     userCard.style.display = 'flex';
    if (displayName)  displayName.innerText = nombre;
}

function cerrarSesion() {
    localStorage.removeItem('beatflow_current_user');
    window.location.reload();
}


// ============================================================
// --- 2. SUPABASE — FUNCIONES DE DATOS ---
// ============================================================

async function obtenerUsuarios() {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/usuarios?select=nombre&order=created_at.asc`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        if (!res.ok) {
            console.error("Error al obtener usuarios:", await res.text());
            return [];
        }

        const data = await res.json();
        return data.map(u => u.nombre);

    } catch (err) {
        console.error("Error de red al obtener usuarios:", err);
        return [];
    }
}

async function insertarUsuario(nombre) {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/usuarios`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ nombre })
        });

        if (!res.ok) {
            console.error("Error al insertar usuario:", await res.text());
            return false;
        }

        return true;

    } catch (err) {
        console.error("Error de red al insertar usuario:", err);
        return false;
    }
}

async function actualizarListaPublica() {
    const listaDiv = document.getElementById('user-list');
    if (!listaDiv) return;

    const usuarios = await obtenerUsuarios();

    if (usuarios.length > 0) {
        listaDiv.innerHTML = usuarios
            .map(u => `<span class="user-tag">${u}</span>`)
            .join('');
    } else {
        listaDiv.innerHTML = "<p style='color: #666; font-size: 0.8rem;'>No hay oyentes registrados aún.</p>";
    }
}


// ============================================================
// --- 3. SUPABASE REALTIME — Actualización automática ---
// ============================================================

function iniciarRealtime() {
    if (typeof window.supabase === 'undefined') {
        console.warn("SDK de Supabase no encontrado. El tiempo real no estará activo.");
        return;
    }

    const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    client
        .channel('oyentes-online')
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'usuarios' },
            () => actualizarListaPublica()
        )
        .subscribe((status) => {
            console.log('Realtime Supabase:', status);
        });
}


// ============================================================
// --- 4. CARGA DE MÚSICA (db.json) ---
// ============================================================

async function cargarMusica() {
    const catalogo        = document.getElementById('anime-list');
    const reproductor     = document.getElementById('video-player');
    const tituloPrincipal = document.getElementById('current-title');

    try {
        const res = await fetch('./db.json');
        if (!res.ok) throw new Error("No se pudo cargar db.json");

        const canciones = await res.json();
        catalogo.innerHTML = '';

        canciones.forEach(track => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'anime-card';
            tarjeta.innerHTML = `
                <img src="${track.poster}" alt="${track.titulo}">
                <div class="card-info" style="padding: 10px;">
                    <strong style="color: #fff; font-size: 0.9rem;">${track.titulo}</strong><br>
                    <small style="color: #888;">${track.episodio}</small>
                </div>
            `;

            tarjeta.onclick = () => {
                reproductor.src = `${track.videoUrl}?autoplay=1&mute=0&rel=0`;
                tituloPrincipal.innerText = `Escuchando: ${track.titulo}`;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };

            catalogo.appendChild(tarjeta);
        });

    } catch (error) {
        console.error("Error en cargarMusica:", error);
        if (catalogo) {
            catalogo.innerHTML = `
                <p style="color:red; grid-column: 1/-1;">
                    Error: No se pudieron cargar las estaciones. Revisa tu db.json.
                </p>`;
        }
    }
}


// ============================================================
// --- 5. ARRANQUE DE LA APP ---
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {

    // A. Evitar flash del modal si ya hay sesión activa
    const usuarioActual = localStorage.getItem('beatflow_current_user');
    if (usuarioActual) {
        const modal = document.getElementById('register-modal');
        if (modal) modal.style.display = 'none';
        mostrarInterfazUsuario(usuarioActual);
    }

    // B. Cargar lista de oyentes desde Supabase
    await actualizarListaPublica();

    // C. Activar escucha en tiempo real
    iniciarRealtime();

    // D. Cargar catálogo de música
    cargarMusica();
});
