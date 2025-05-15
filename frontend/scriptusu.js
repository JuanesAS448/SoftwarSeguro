document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'https://proyectosoftwareseguro.netlify.app/api/usuarios';
    let paginaActual = 1;
    const ITEMS_POR_PAGINA = 10;

    // Función para validar el email
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Función para validar el DNI
    function isValidDNI(dni) {
        return /^\d+$/.test(dni);
    }

    // Función para mostrar mensajes
    function showMessage(message, isError = false, elementId = 'mensajeRegistro') {
        const alertElement = document.getElementById(elementId);
        alertElement.textContent = message;
        alertElement.className = `alert ${isError ? 'alert-danger' : 'alert-success'}`;
        alertElement.style.display = 'block';
        setTimeout(() => {
            alertElement.style.display = 'none';
        }, 3000);
    }

    // Función para renderizar la tabla de usuarios
    function renderizarTablaUsuarios(usuarios) {
        const tabla = document.getElementById('tablaUsuarios');
        tabla.innerHTML = '';

        usuarios.forEach(usuario => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${usuario.dni}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.apellidos}</td>
                <td>${usuario.email}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editarUsuario('${usuario.dni}')">
                        Editar
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarUsuario('${usuario.dni}')">
                        Eliminar
                    </button>
                </td>
            `;
            tabla.appendChild(tr);
        });
    }

    // Función para renderizar la paginación
    function renderizarPaginacion(paginacion) {
        const paginacionElement = document.getElementById('paginacion');
        paginacionElement.innerHTML = '';

        // Botón Anterior
        const anterior = document.createElement('li');
        anterior.className = `page-item ${paginacion.pagina === 1 ? 'disabled' : ''}`;
        anterior.innerHTML = `
            <a class="page-link" href="#" onclick="cambiarPagina(${paginacion.pagina - 1})">
                Anterior
            </a>
        `;
        paginacionElement.appendChild(anterior);

        // Páginas
        for (let i = 1; i <= paginacion.totalPaginas; i++) {
            const pagina = document.createElement('li');
            pagina.className = `page-item ${i === paginacion.pagina ? 'active' : ''}`;
            pagina.innerHTML = `
                <a class="page-link" href="#" onclick="cambiarPagina(${i})">
                    ${i}
                </a>
            `;
            paginacionElement.appendChild(pagina);
        }

        // Botón Siguiente
        const siguiente = document.createElement('li');
        siguiente.className = `page-item ${paginacion.pagina === paginacion.totalPaginas ? 'disabled' : ''}`;
        siguiente.innerHTML = `
            <a class="page-link" href="#" onclick="cambiarPagina(${paginacion.pagina + 1})">
                Siguiente
            </a>
        `;
        paginacionElement.appendChild(siguiente);
    }

    // Guardar usuario
    window.guardar = async function(event) {
        event.preventDefault();
        
        const dni = document.getElementById("dni").value;
        const nombre = document.getElementById("nombre").value;
        const apellidos = document.getElementById("apellidos").value;
        const email = document.getElementById("correo").value;

        if (!isValidDNI(dni)) {
            showMessage("El DNI debe contener solo números", true);
            return;
        }

        if (!isValidEmail(email)) {
            showMessage("Por favor, ingrese un email válido", true);
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dni,
                    nombre,
                    apellidos,
                    email
                })
            });

            if (!response.ok) {
                throw new Error('Error al guardar el usuario');
            }

            const result = await response.json();
            showMessage(result.message || 'Usuario guardado exitosamente');
            document.getElementById("adicionarEstudiante").reset();
            
            // Actualizar la lista de usuarios
            buscarUsuarios();
        } catch (error) {
            showMessage('Error: ' + error.message, true);
        }
    };

    // Buscar usuarios
    window.buscarUsuarios = async function(pagina = 1) {
        const termino = document.getElementById('terminoBusqueda').value;
        paginaActual = pagina;

        try {
            let url = `${API_URL}?pagina=${pagina}&limite=${ITEMS_POR_PAGINA}`;
            if (termino) {
                url += `&buscar=${encodeURIComponent(termino)}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error al buscar usuarios');
            }

            const data = await response.json();
            renderizarTablaUsuarios(data.usuarios);
            renderizarPaginacion(data.paginacion);
        } catch (error) {
            showMessage(error.message, true, 'mensajeBusqueda');
        }
    };

    // Cambiar página
    window.cambiarPagina = function(pagina) {
        buscarUsuarios(pagina);
    };

    // Editar usuario
    window.editarUsuario = async function(dni) {
        try {
            const response = await fetch(`${API_URL}/${dni}`);
            if (!response.ok) {
                throw new Error('Usuario no encontrado');
            }

            const usuario = await response.json();
            
            // Llenar el modal con los datos del usuario
            document.getElementById('editDni').value = usuario.dni;
            document.getElementById('editNombre').value = usuario.nombre;
            document.getElementById('editApellidos').value = usuario.apellidos;
            document.getElementById('editEmail').value = usuario.email;

            // Mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById('editarUsuarioModal'));
            modal.show();
        } catch (error) {
            showMessage(error.message, true);
        }
    };

    // Actualizar usuario
    window.actualizarUsuario = async function() {
        const dni = document.getElementById('editDni').value;
        const datos = {
            nombre: document.getElementById('editNombre').value,
            apellidos: document.getElementById('editApellidos').value,
            email: document.getElementById('editEmail').value
        };

        try {
            const response = await fetch(`${API_URL}/${dni}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datos)
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el usuario');
            }

            const result = await response.json();
            showMessage(result.message || 'Usuario actualizado exitosamente');
            
            // Cerrar el modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editarUsuarioModal'));
            modal.hide();
            
            // Actualizar la lista de usuarios
            buscarUsuarios(paginaActual);
        } catch (error) {
            showMessage(error.message, true);
        }
    };

    // Eliminar usuario
    window.eliminarUsuario = async function(dni) {
        if (!confirm('¿Está seguro de que desea eliminar este usuario?')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${dni}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el usuario');
            }

            const result = await response.json();
            showMessage(result.message || 'Usuario eliminado exitosamente');
            
            // Actualizar la lista de usuarios
            buscarUsuarios(paginaActual);
        } catch (error) {
            showMessage(error.message, true);
        }
    };

    // Cargar usuarios inicialmente
    buscarUsuarios();
});