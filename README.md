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


