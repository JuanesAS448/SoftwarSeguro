document.addEventListener('DOMContentLoaded', function() {
    // Todas las funciones existentes se mantienen aquí
    window.guardar = function(event) {
        event.preventDefault();
        
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        const raw = JSON.stringify({
            "dni": document.getElementById("dni").value,
            "nombre": document.getElementById("nombre").value,
            "apellidos": document.getElementById("apellidos").value,
            "email": document.getElementById("correo").value
        });
    
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
    
        fetch("https://proyectosoftwareseguro.netlify.app/", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.error(error));
    };
    
    window.cargar = function(resultado) {
        try {
            const transformado = JSON.parse(resultado);
            let salida = "";
            
            for (const [clave, valor] of Object.entries(transformado)) {
                salida = `Clave=${clave} Valor=${valor}<br>${salida}`;
            }
            document.getElementById("rta").innerHTML = salida;
        } catch (error) {
            console.error('Error al procesar el resultado:', error);
            document.getElementById("rta").innerHTML = 'Error al procesar los datos';
        }
    };
    
    window.listar = function(event) {
        event.preventDefault();
        
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };
        
        const ndoc = document.getElementById("numdoc").value;
        
        fetch("https://proyectosoftwareseguro.netlify.app/" + ndoc, requestOptions)
            .then(response => response.text())
            .then(result => window.cargar(result))
            .catch(error => console.error(error));
    };
});