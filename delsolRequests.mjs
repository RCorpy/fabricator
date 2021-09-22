let auth = ""

const authHeader = () => {
    return {
        'Content-Type': 'application/json',
        Authorization:`Bearer ${auth}`
    }
  }

async function getAuth(url = 'https://api.sdelsol.com/login/Autenticar', data = {
    codigoFabricante: connectionInfo.codigoFabricante,
    codigoCliente: connectionInfo.codigoCliente,
    baseDatosCliente:connectionInfo.baseDatosCliente,
    password: connectionInfo.password}) {
    // Opciones por defecto estan marcadas con un *
    const response = await fetch(url, {
      method: 'POST', 
      mode: 'cors', 
      cache: 'no-cache', 
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', 
      referrerPolicy: 'no-referrer', 
      body: JSON.stringify(data) 
    });
    return response.json(); 
  }

  async function getPresupuesto(data, url = "https://api.sdelsol.com/admin/LanzarConsulta") {
    // Opciones por defecto estan marcadas con un *
    const response = await fetch(url, {
      method: 'POST', 
      mode: 'cors', 
      cache: 'no-cache', 
      credentials: 'same-origin',
      headers: authHeader(),
      redirect: 'follow', 
      referrerPolicy: 'no-referrer', 
      body: JSON.stringify(data) 
    });
    return response.json(); 
  }

  async function getArticulos(data, url = "https://api.sdelsol.com/admin/LanzarConsulta") {
    // Opciones por defecto estan marcadas con un *
    const response = await fetch(url, {
      method: 'POST', 
      mode: 'cors', 
      cache: 'no-cache', 
      credentials: 'same-origin',
      headers: authHeader(),
      redirect: 'follow', 
      referrerPolicy: 'no-referrer', 
      body: JSON.stringify(data) 
    });
    return response.json(); 
  }

  async function crearHojaDeFabricacion(data, url = "https://api.sdelsol.com/admin/EscribirRegistro") {
    // Opciones por defecto estan marcadas con un *
    const response = await fetch(url, {
      method: 'POST', 
      mode: 'cors', 
      cache: 'no-cache', 
      credentials: 'same-origin',
      headers: authHeader(),
      redirect: 'follow', 
      referrerPolicy: 'no-referrer', 
      body: JSON.stringify(data) 
    });
    return response.json(); 
  }

  async function crearDatosHojaDeFabricacion(data, url ="https://api.sdelsol.com/admin/EscribirRegistro"){
    const response = await fetch(url, {
    method: 'POST', 
    mode: 'cors', 
    cache: 'no-cache', 
    credentials: 'same-origin',
    headers: authHeader(),
    redirect: 'follow', 
    referrerPolicy: 'no-referrer', 
    body: JSON.stringify(data) 
  });
  return response.json(); 
}


  async function getCodigoHojaDeFabricacion(url= "https://api.sdelsol.com/admin/LanzarConsulta", data = {
    ejercicio: "2021",
    consulta: "SELECT * FROM F_FCO"
  }){
    const response = await fetch(url, {
      method: 'POST', 
      mode: 'cors', 
      cache: 'no-cache', 
      credentials: 'same-origin',
      headers: authHeader(),
      redirect: 'follow', 
      referrerPolicy: 'no-referrer', 
      body: JSON.stringify(data) 
    });
    return response.json(); 
  }


async function crearSubarticulosHojaDeFabricacion(data, url ="https://api.sdelsol.com/admin/EscribirRegistro"){
    const response = await fetch(url, {
    method: 'POST', 
    mode: 'cors', 
    cache: 'no-cache', 
    credentials: 'same-origin',
    headers: authHeader(),
    redirect: 'follow', 
    referrerPolicy: 'no-referrer', 
    body: JSON.stringify(data) 
  });
  return response.json(); 
}