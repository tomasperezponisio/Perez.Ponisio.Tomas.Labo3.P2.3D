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

![Ajax](https://i.imgur.com/slRaTgh.png)
![Ajax](https://i.imgur.com/qSDJmcY.png)

### Armado de anuncios con los elementos del DOM
