function guardar(){
 
    let apellidos='';
    let datoingresado = document.getElementById("correo").value;
 
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    event.preventDefault();
 
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
 
    fetch("https://ejemplodesarrollosoft.netlify.app/", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
}
 
function cargar(resultado){
    let transformado = JSON.parse(resultado);
    var salida="";
    var elemento="";
 
    for (const [clave, valor] of Object.entries(transformado)) {
        //console.log(${clave}: ${valor});
        salida = "Clave=" + clave +  " Valor=" + valor + "<br>" + salida;
    }
    document.getElementById("rta").innerHTML = salida;
}
 
function listar(){
    event.preventDefault();
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    let ndoc = document.getElementById("numdoc").value;
    //usuarios?id=user124
         //https://proyectofinaldsws.netlify.app/.netlify/functions/usuarios
    fetch("https://ejemplodesarrollosoft.netlify.app/"+ndoc, requestOptions)
      .then((response) =>
        response.text())
      .then((result) =>
        cargar(result))
      .catch((error) =>
        console.error(error));
}