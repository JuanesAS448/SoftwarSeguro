document.addEventListener('DOMContentLoaded', function() {
    // Función para validar el email
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Función para validar el DNI (asumiendo que debe ser numérico)
    function isValidDNI(dni) {
        return /^\d+$/.test(dni);
    }

    // Función para mostrar mensajes de error
    function showError(message) {
        console.error(message);
        alert(message);
    }

    window.guardar = function(event) {
        event.preventDefault();
        
        const dni = document.getElementById("dni").value;
        const nombre = document.getElementById("nombre").value;
        const apellidos = document.getElementById("apellidos").value;
        const email = document.getElementById("correo").value;

        // Validaciones
        if (!isValidDNI(dni)) {
            showError("El DNI debe contener solo números");
            return;
        }

        if (!isValidEmail(email)) {
            showError("Por favor, ingrese un email válido");
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        const raw = JSON.stringify({
            "dni": dni,
            "nombre": nombre,
            "apellidos": apellidos,
            "email": email
        });
    
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
    
        fetch("https://proyectosoftwareseguro.netlify.app/", requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.text();
            })
            .then(result => {
                console.log(result);
                alert('Usuario guardado exitosamente');
                document.getElementById("adicionarEstudiante").reset();
            })
            .catch(error => {
                console.error('Error:', error);
                showError('Error al guardar el usuario: ' + error.message);
            });
    };
    
    window.cargar = function(resultado) {
        try {
            const transformado = JSON.parse(resultado);
            let salida = "<table border='1'><tr><th>Campo</th><th>Valor</th></tr>";
            
            for (const [clave, valor] of Object.entries(transformado)) {
                salida += `<tr><td>${clave}</td><td>${valor}</td></tr>`;
            }
            salida += "</table>";
            document.getElementById("rta").innerHTML = salida;
        } catch (error) {
            console.error('Error al procesar el resultado:', error);
            document.getElementById("rta").innerHTML = 'Error al procesar los datos';
            showError('Error al procesar los datos del usuario');
        }
    };
    
    window.listar = function(event) {
        event.preventDefault();
        
        const ndoc = document.getElementById("numdoc").value;
        
        if (!isValidDNI(ndoc)) {
            showError("El documento debe contener solo números");
            return;
        }

        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };
        
        document.getElementById("rta").innerHTML = 'Buscando...';
        
        fetch("https://proyectosoftwareseguro.netlify.app/" + ndoc, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Usuario no encontrado');
                }
                return response.text();
            })
            .then(result => window.cargar(result))
            .catch(error => {
                console.error('Error:', error);
                document.getElementById("rta").innerHTML = 'Error: ' + error.message;
            });
    };
});