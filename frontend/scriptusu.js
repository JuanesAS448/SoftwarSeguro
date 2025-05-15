function guardar(event){
    event.preventDefault();
    
    let apellidos='';
    let datoingresado = document.getElementById("correo").value;
 
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
 
    let raw = JSON.stringify({
      "dni": document.getElementById("dni").value,
      "nombre": document.getElementById("nombre").value,
      "apellidos": document.getElementById("apellidos").value,
      "email": document.getElementById("correo").value
    });
 
    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
 
    fetch("https://proyectosoftwareseguro.netlify.app/", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
}
 
function cargar(resultado){
    let transformado = JSON.parse(resultado);
    var salida="";
    var elemento="";
 
    for (const [clave, valor] of Object.entries(transformado)) {
        salida = "Clave=" + clave +  " Valor=" + valor + "<br>" + salida;
    }
    document.getElementById("rta").innerHTML = salida;
}
 
function listar(event){
    event.preventDefault();
    
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    
    let ndoc = document.getElementById("numdoc").value;
    
    fetch("https://proyectosoftwareseguro.netlify.app/"+ndoc, requestOptions)
      .then((response) => response.text())
      .then((result) => cargar(result))
      .catch((error) => console.error(error));
}