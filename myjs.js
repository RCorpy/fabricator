//imported connectionInfo from index.html
//imported ...

let buscarField = document.getElementById("buscarField")
let basicInfoElement = document.getElementsByClassName("showBasicInfo")[0]
let infoElement = document.getElementsByClassName("info")[0]
let printTop = document.getElementsByClassName("printtop")[0]
let printElement = document.getElementsByClassName("printbody")[0]

let searchValue=""
let presupuesto
let articulos
let subArticulos
let selectedNombre
let selectedCodigo
let selectedCantidad

const unnecesaryWordsInArticulos = ["CUBO", "BALANZA", "RODILLO", "MANO", "ENVASE"]

const clickBuscar = async () =>{
    searchValue = buscarField.value
    

    if(searchValue.length === 8){
        presupuesto = await buscarPresupuesto()
        let codigoPresupuesto = presupuesto[1].dato
        articulos = await buscarArticulo(codigoPresupuesto)

        basicInfoElement.innerHTML = "Se muestra: " + searchValue
        //console.log(presupuesto)
        articulos = standarizarArticulos(articulos, 4,5, 3)
        articulos = filtrarArticulos(articulos)
        showArticulos(articulos)
    }
    else{
        basicInfoElement.innerHTML = "Deberia haber 8 numeros, hay " + searchValue.length
        //infoElement.innerHTML = connectionInfo.password

    }
}

const standarizarArticulos = (articulos, nombrePosition, cantidadPosition, codigoPosition) => {
    articulos = articulos.map(element=>([element[nombrePosition].dato, element[cantidadPosition].dato, element[codigoPosition].dato]))
    return articulos
    
}

const buscarPresupuesto = async () => {
    auth = await getAuth()
    auth = auth.resultado
    console.log(auth)
    let sendData = {
        ejercicio: "2021",
        consulta: `SELECT * FROM F_PRE WHERE REFPRE = '${searchValue}'`
    }

    presupuesto = await getPresupuesto(sendData)
    return presupuesto.resultado[0]
}

const buscarArticulo = async (codigoPresupuesto) => {
    let sendData = {
        ejercicio: "2021",
        consulta: `SELECT * FROM F_LPS WHERE CODLPS = '${codigoPresupuesto}'`
    }

    presupuesto = await getArticulos(sendData)
    return presupuesto.resultado
}

const buscarArticulos = async (codigosPresupuesto) => {
    let queryString = codigosPresupuesto.map(element => (`CODLPS = '${element}'`)).join(" OR ")
    console.log(queryString)
    let sendData = {
        ejercicio: "2021",
        consulta: `SELECT * FROM F_LPS WHERE ${queryString}`
    }

    presupuesto = await getArticulos(sendData)
    return presupuesto.resultado
}

const buscarDesglose = async (codigoArticulo) => {
    let sendData = {
        ejercicio: "2021",
        consulta: `SELECT * FROM F_COM WHERE CODCOM = '${codigoArticulo}'`
    }

    subArticulos = await getArticulos(sendData)
    //subArticulos = standarizarArticulos(subArticulos, 5, AQUI VA LA CANTIDAD ,0)
    //subArticulos = filtrarArticulos(subArticulos.resultado)

    return subArticulos
}

const filtrarArticulos = (articulos, words = unnecesaryWordsInArticulos) =>{
        
        //filtrar los articulos que contienen las palabras no deseadas
        for(let j=0; j<words.length; j++){
            
            articulos = articulos.filter((element)=>(!element[0].includes(words[j])))
        }

        return articulos
}

const showArticulos = (articulos) => {
    let html = ""


    for(let i = 0; i< articulos.length ; i++){
        html = html + `
        <div class="articulorow">
        <div class="articulo">
        <button class="${articulos[i][0].includes("KIT") ? "verde": ""}"id="desglosar${i}" onclick="desglosar(${i}, ${articulos[i][1]})">Desglosar</button>
        <span> ${articulos[i][0]}</span>
        <input id="input${i}" type="number" value=${articulos[i][1]}></input>
        <button id="cambiar${i}" onclick="cambiarCantidad(${i})">Modificar</button>
        <button id="eliminar${i}" onclick="eliminarArticulo(${i})">Borrar</button>
        </div>
        <div class="printdiv">
        <button id="seleccionar${i}" onclick="seleccionarArticulo(${i}, ${articulos[i][1]})">Seleccionar</button>
        </div>
        </div>
        `
    }

    infoElement.innerHTML = html
}

const cambiarCantidad = (i) => {
    const pressedButton = document.getElementById(`input${i}`)
    articulos[i][1] = pressedButton.value
    showArticulos(articulos)
}

const eliminarArticulo = (i) => {
    articulos.splice(i,1)
    showArticulos(articulos)
}

const desglosar = async (i, cantidad) =>{
    const codigo = articulos[i][2]
    console.log(codigo, cantidad)

    eliminarArticulo(i)
    let newArticulos = await buscarDesglose(codigo)
    newArticulos = newArticulos.resultado

    newArticulos = newArticulos.map(element=>([element[2].dato, element[4].dato * cantidad, element[1].dato]))
    newArticulos= filtrarArticulos(newArticulos)

    articulos = articulos.concat(newArticulos)

    showArticulos(articulos)
}

const seleccionarArticulo = async (i, cantidad) =>{
    
    selectedNombre = articulos[i][0]
    selectedCodigo = articulos[i][2]
    selectedCantidad = cantidad
    
    subArticulos = await buscarDesglose(selectedCodigo)
    subArticulos = subArticulos.resultado

    subArticulos = subArticulos.map(element=>([element[2].dato, element[4].dato * cantidad, element[1].dato]))
    subArticulos = filtrarArticulos(subArticulos, ["MANO"])

    let html = ""

    //titulo

    printTop.innerHTML = `<span>${selectedNombre} * ${cantidad}</span><span>Pedido: ${buscarField.value}</span>`

    //articulos

    for(let i=0; i<subArticulos.length; i++){
        html = html + `<div class="printrow"><span classname="printnumero">${subArticulos[i][2]}</span><span classname="printtexto">${subArticulos[i][0]}</span><span classname="printnumero">${subArticulos[i][1].toFixed(4)}</span><span classname="printnumero">${subArticulos[i][2]}</span></div>`
    }

    printElement.innerHTML = html

}

const imprimir = () => {

    crearFabricacion()

    var headstr = "<html><head><title>Booking Details</title></head><body>";
    var footstr = "</body>";
    var newstr = "<div class='print'> <div class='printtop'>" + printTop.innerHTML +"</div><div class='printbody'>"+ printElement.innerHTML+ "</div></div>";
    var oldstr = document.body.innerHTML;
    document.body.innerHTML = headstr+newstr+footstr;
    window.print();
    document.body.innerHTML = oldstr;

    buscarField = document.getElementById("buscarField")
    basicInfoElement = document.getElementsByClassName("showBasicInfo")[0]
    infoElement = document.getElementsByClassName("info")[0]
    printTop = document.getElementsByClassName("printtop")[0]
    printElement = document.getElementsByClassName("printbody")[0]
    return false;
}

const crearFabricacion = async ()=>{
    //conseguir el siguiente numero de codigo
    let codigoHojaDeFabricacion = await getCogidoHojaDeFabricacion()
    codigoHojaDeFabricacion = codigoHojaDeFabricacion.resultado[codigoHojaDeFabricacion.resultado.length-1][0].dato +1
    //conseguir fecha formateada
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; 
    let yyyy = today.getFullYear();
    if(dd<10) {
        dd='0'+dd;
    } 
    if(mm<10) {
        mm='0'+mm;
    } 
    today = yyyy+'-'+mm+'-'+dd;
    //
    let sendData={
        ejercicio: "2021",
        tabla: "F_FCO",
        registro: [
        {
            "columna": "CODFCO",
            "dato": codigoHojaDeFabricacion
        },
        {
            "columna": "FECFCO",
            "dato": today
        },
        {
            "columna": "ALMFCO",
            "dato": "GEN"
        },
        {
            "columna": "ESTFCO",
            "dato": 1
        },
        {
            "columna": "OBSFCO",
            "dato": buscarField.value + " " + selectedNombre + " " + selectedCodigo
        },
        ]
    }
    console.log(sendData)
    let hojaDeFabricacion = await crearHojaDeFabricacion(sendData)

    sendData={
        ejercicio: "2021",
        tabla: "F_LFC",
        registro: [
        {
            "columna": "CODLFC",
            "dato": codigoHojaDeFabricacion
        },
        {
            "columna": "POSLFC",
            "dato": 1
        },
        {
            "columna": "ARTLFC",
            "dato": selectedCodigo
        },
        {
            "columna": "DESLFC",
            "dato": selectedNombre
        },
        {
            "columna": "CANLFC",
            "dato": selectedCantidad
        },
        ]
    }
    console.log(sendData)
    //let datosHojaDeFabricacion = await crearDatosHojaDeFabricacion(sendData)

    return hojaDeFabricacion
}