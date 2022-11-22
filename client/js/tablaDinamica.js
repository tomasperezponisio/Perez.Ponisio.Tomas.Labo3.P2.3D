
// el row que me pasan es el primer objeto del array
function crearCabecera(row) {
    const cabecera = document.createElement("thead"),
        tr = document.createElement("tr");
    // recorro con un for in las keys del objeto, no quiero el valor, quiero las keys
    for (const key in row) {
        if (key === "id") {
            // el continue salta a la siguiente iteracion, entonces cuando me encuentre con id no ejecuto
            // el codigo de las lineas 14-17 y salteo a la siguiente iteracion
            continue;
        }
        // por cada elemento del objeto, creo una th y le agrego como contenido el nombre de la key
        const th = document.createElement("th");
        th.classList.add("text-capitalize");
        th.textContent = key;
        tr.appendChild(th);
    }
    cabecera.appendChild(tr);
    return cabecera;
}

function crearCuerpo(data) {
    const cuerpo = document.createElement("tbody");
    data.forEach(elemento => {
        const fila = document.createElement("tr");
        for (const atributo in elemento) {
            if (atributo === "id") {
                fila.setAttribute("data-id", elemento[atributo]);
                // el continue salta a la siguiente iteracion, entonces cuando me encuentre con id no ejecuto
                // el codigo de las lineas 14-17 y salteo a la siguiente iteracion
                continue;
            }
            const celda = document.createElement("td");
            if (atributo == "precio") {
                celda.textContent = "$" + elemento[atributo];
            } else {
                celda.textContent = elemento[atributo];
            }
            fila.appendChild(celda);
            fila.classList.add("puntero");
        }
        const filas = cuerpo.children;
        for (let i = 0; i < filas.length; i++) {
            if (!(i % 2)) {
                filas[i].classList.add("gris");
            }
        }
        cuerpo.appendChild(fila);
    });
    return cuerpo;
}

export function crearTabla(data) {
    if (!Array.isArray(data)) {
        return null;
    }
    const tabla = document.createElement("table");
    tabla.setAttribute("class", "table table-hover")
    tabla.appendChild(crearCabecera(data[0]));
    tabla.appendChild(crearCuerpo(data));
    return tabla;
}

