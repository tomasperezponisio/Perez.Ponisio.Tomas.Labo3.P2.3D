# Tomás Pérez Ponisio - ABM Petshop

***Link al sitio deployado: https://mitrepetshop.netlify.app***

## Requerimientos de la aplicación

- Desarrollar una aplicación que muestre el listado de los anuncios de mascotas, así como un formulario para dar de alta a nuevos anuncios.
- La lista de anuncios se genera dinámicamente (con código JS) trabajando con el DOM.
- En el formulario se validan los datos, y clickeando un anuncio de la lista se puede editar o eliminar (manejados de eventos).
- Los datos se traen con peticiones AJAX.

## Anuncios

![Anuncios](https://i.imgur.com/nQBLWGM.png)

### Petición AJAX (promesa) para traer los datos de los anuncios

```Javascript
// Exporto la funcion para traer los anuncios que hace una petición ajax, si se resuelve correctamente
// trae los datos, en caso contrario captura el error
export const getAnuncios = () => {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", URL);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send();
  });
};
```

```Javascript
const promesa = getAnuncios();
setSpinner(divSpinner, "./img/spinner.gif");
// Dentro del metodo .then (promesa fulfilled) con la data de todos los anuncios voy creandolos individualmente
// llamando la función crearTarjeta()
promesa.then((data) => {
    anuncios = JSON.parse(data);
    anuncios.forEach((elemento) => {
        const $nuevaTarjeta = crearTarjeta(
            elemento.titulo,
            elemento.descripcion,
            elemento.animal,
            elemento.precio,
            elemento.raza,
            elemento.fecha_nacimiento,
            elemento.vacuna);
        $divCards.append($nuevaTarjeta);
    });
    clearSpinner(divSpinner);
})
    .catch((err) => {
        console.error(err);
    });
```

### Armado de anuncios con los elementos del DOM

```Javascript
// Recibo los datos de cada anuncio que traje con la peticion
function crearTarjeta(titulo, descripcion, animal, precio, raza, fecha_nacimiento, vacuna) {
    // Voy creando los tags html y agregando estilos
    const divCol = document.createElement("div");
    divCol.classList.add("col", "py-3");
    const divCard = document.createElement("div");
    divCard.classList.add("card", "border-danger");
    const divCardHeader = document.createElement("div");
    divCardHeader.classList.add("card-header");
    const divCardTitle = document.createElement("div");
    divCardTitle.classList.add("text-uppercase", "text-warning", "fs-3", "fw-bold");
    // Y agregando la info del anuncio
    divCardTitle.textContent = titulo;
    const divCardBody = document.createElement("div");
    divCardBody.classList.add("card-body");
    const divCardFooter = document.createElement("div");
    divCardFooter.classList.add("card-footer");
    const _descripcion = document.createElement("p");
    _descripcion.textContent = "Descripción: " + descripcion;
    const _precio = document.createElement("p");
    _precio.classList.add("text-uppercase", "text-warning", "fs-4", "fw-bold");
    _precio.textContent = "Precio: $" + precio;
    const _animal = document.createElement("p");
    _animal.textContent = "Animal: " + animal;
    const _raza = document.createElement("p");
    _raza.textContent = "Raza: " + raza;
    const _fecha_nacimiento = document.createElement("p");
    _fecha_nacimiento.textContent = "Fecha Nacimiento: " + fecha_nacimiento;
    const _vacuna = document.createElement("p");
    _vacuna.textContent = "Vacuna: " + vacuna;

    // Voy haciendo los append de cada elemento de la tarjeta
    divCol.appendChild(divCard);
    divCard.appendChild(divCardHeader);
    divCardHeader.appendChild(divCardTitle);
    divCard.appendChild(divCardBody);
    divCard.appendChild(divCardFooter);
    divCardBody.appendChild(_descripcion);
    divCardBody.appendChild(_animal);
    divCardBody.appendChild(_raza);
    divCardBody.appendChild(_fecha_nacimiento);
    divCardBody.appendChild(_vacuna);
    divCardFooter.appendChild(_precio);

    return divCol;
}
```

```Javascript
// Tomo referencia del main de la pagina
const $main = document.querySelector('main');
// Me creo una referencia del container donde iran las fichas
const $divContainer = document.createElement("div");
$divContainer.classList.add("container");
// Creo referencia del div donde iran las fichas
const $divCards = document.createElement("div");
$divCards.classList.add("row", "row-cols-1", "row-cols-md-3", "text-center");
// Hago los append, del container al main y del div de las fichas al container
$main.appendChild($divContainer);
$divContainer.appendChild($divCards);
```

![Formulario](https://i.imgur.com/OggVBaJ.png)

```Javascript
// Dos escuchadores, al cargarse la pagina y al submit del form
window.addEventListener("load", () => {
  esconderBotonEliminar();

  $formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // me fijo si hay algun campo del form que no se haya completado
    // y valido los campos del form antes de submit
    if (!validarFormVacio() && validarSubmit()) {
      // borro el mensaje de error de submit
      $alertSubmit.textContent = "";
      $alertSubmit.classList.remove("danger", "text-danger", "fw-bold");

      // si el formulario esta para cargar un nuevo anuncio tomo los valores del form, el target,
      // y con esos datos creo el nuevo anuncio (objeto de la clase anuncio)
      if ($formulario.btnCargar.value == "Cargar") {
        console.log("Cargar");
        const { titulo, descripcion, precio, animal, raza, fecha_nacimiento, vacuna } = e.target;
        const nuevoAnuncio = new Anuncio_Mascota(
          null,
          titulo.value,
          descripcion.value,
          precio.value,
          animal.value,
          raza.value,
          fecha_nacimiento.value,
          vacuna.value);
          // si el anuncio se creo correctamentente, se lo paso a la funcion que crea el anuncio
          // y actualizo la tabla que se encuentra debajo con todos los anuncios
        if (nuevoAnuncio) {
          createAnuncio(nuevoAnuncio);
          actualizarTabla();
        }
      // Si el formulario esta para modificar, con el id del anuncio seleccionado, le paso los datos
      // a la funcion modificarAnuncio() que actualiza el objeto anuncio y despues a la funcion 
      // updateAnuncio() le paso el anuncio actualizado y ésta hace una peticion fetch(PUT) 
      // para actualizar la db, finalmente actualizo la tabla de anuncios
      } else if ($formulario.btnCargar.value == "Modificar") {
        console.log("Modificar");
        console.log(idSeleccionado);
        const anuncio = anuncios.find((element) => element.id == idSeleccionado);
        modificarAnuncio(anuncio);
        updateAnuncio(anuncio);
        actualizarTabla();
      }
    } else {
      console.log("ERROR DE SUBMIT");
      // cargo el mensaje de error de submit
      $alertSubmit.textContent = "Faltan campos requeridos o hay campos invalidos";
      $alertSubmit.classList.add("danger", "text-danger", "fw-bold");
    }
  });
});
```

```Javascript
// para traer los datos del elemento clickeado, un escuchador al click en la tabla
let idSeleccionado;
$divTabla.addEventListener("click", (e) => {
  $alertSubmit.textContent = "";
  $alertSubmit.classList.remove("danger");
  const emisor = e.target;
  if (emisor.matches("tbody tr td")) {
    let id = emisor.parentElement.dataset.id;
    const anuncio = anuncios.find((element) => element.id == id);
    console.log(anuncio);
    idSeleccionado = id;
    cargarFormulario(anuncio);
    $formulario.btnCargar.value = "Modificar";
    $formulario.btnCargar.classList.add("btn-primary");
    $formulario.btnCargar.classList.remove("btn-success");
    mostrarBotonEliminar();
    removerErrores();
  }
});
```

![Tabla de anuncios](https://i.imgur.com/3C70779.png)

### Petición fetch para traer los datos

```Javascript
let anuncios = await getAnunciosAsync();
actualizarTabla();
```

```Javascript
export const getAnunciosAsync = async () => {
  try {
    setSpinner(divSpinner, "./img/spinner.gif");
    const res = await fetch(URL);
    if (!res.ok) { throw new Error(`Error: ${res.status} - ${res.statusText} `) }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(err);
  }
  finally {
    clearSpinner(divSpinner);
  }
};
```

### Armado de la tabla con los elementos del DOM

```Javascript
function actualizarTabla() {
  // limpio de hijos div tabla
  while ($divTabla.hasChildNodes()) {
    $divTabla.removeChild($divTabla.firstChild);
  }
  // y le meto la tabla que me crea la funcion con la data actualizada
  $divTabla.appendChild(crearTabla(anuncios));
}
```

```Javascript
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
```

```Javascript
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
```

```Javascript
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
```
