import { getAnuncios, setSpinner, clearSpinner } from "./ajax.js";

const divSpinner = document.getElementById("spinner");

let anuncios = [];
// promesa de la data, cuando este fullfilled se carga el array
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

// ---------------- Crear Anuncios Cards ---------------- //

function crearTarjeta(titulo, descripcion, animal, precio, raza, fecha_nacimiento, vacuna) {
    const divCol = document.createElement("div");
    divCol.classList.add("col", "py-3");

    const divCard = document.createElement("div");
    divCard.classList.add("card", "border-danger");

    const divCardHeader = document.createElement("div");
    divCardHeader.classList.add("card-header");
    const divCardTitle = document.createElement("div");
    divCardTitle.classList.add("text-uppercase", "text-warning", "fs-3", "fw-bold");
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

const $main = document.querySelector('main');
const $divContainer = document.createElement("div");
$divContainer.classList.add("container");
const $divCards = document.createElement("div");
$divCards.classList.add("row", "row-cols-1", "row-cols-md-3", "text-center");
$main.appendChild($divContainer);
$divContainer.appendChild($divCards);

