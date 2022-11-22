import { Anuncio_Mascota } from "./anuncio.js";
import { crearTabla } from "./tablaDinamica.js"
import { validarCampoVacio, validarNumero, validarPrecio, validarLongitudMaxima } from "./validaciones.js";
import { getAnunciosAsync, createAnuncio, updateAnuncio, deleteAnuncioAsync } from "./fetch.js";
import { promedio } from "./filtros.js";

// me traigo referencias al form, tabla, botones
const $divTabla = document.querySelector("#divTabla");
const $btnResetForm = document.querySelector("#btnResetForm");
const $btnEliminar = document.querySelector("#btnEliminar");
const $formulario = document.forms[0];
const $alertSubmit = document.getElementById("alertSubmit");
const $promedio = document.getElementById("txtPromedio");
$promedio.value = "N/A";
const $selFiltro = document.getElementById("selFiltro");
const $checkboxes = document.querySelectorAll(".checkboxes");

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

      if ($formulario.btnCargar.value == "Cargar") {
        console.log("Cargar");
        const { titulo, descripcion, precio, animal, raza, fecha_nacimiento, vacuna } = e.target;
        console.log(fecha_nacimiento);
        const nuevoAnuncio = new Anuncio_Mascota(
          null,
          titulo.value,
          descripcion.value,
          precio.value,
          animal.value,
          raza.value,
          fecha_nacimiento.value,
          vacuna.value);
        if (nuevoAnuncio) {
          createAnuncio(nuevoAnuncio);
        }
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

let anuncios = await getAnunciosAsync();
actualizarTabla();

// ----------- Filtros / Promedios
let parametro;
$selFiltro.addEventListener('change', (e) => {
  parametro = e.target.value;
  $promedio.value = "$" + promedio(anuncios, parametro);
  if (parametro == "todos"){
    actualizarTabla();    
  } else {
    let listaFiltrada = anuncios.filter((anuncio) => {
      return anuncio.animal.toLowerCase().includes(parametro.toLowerCase())
    })
    actualizarTablaFiltrada(listaFiltrada);
  }
});

// ----------- Filtro Tabla / Checkboxes ----------------

//obtengo un arrary con los keys a utilizar
const keys = ["id"];
$checkboxes.forEach((elemento) => {
  if (elemento.hasAttribute("checked")) {
    keys.push(elemento.value);
  }
});
// guardo el orden de las keys asi no se me desordena al filtrar con los  checkboxes
const keysOrder = ["id", "titulo", "descripcion", "precio", "animal", "raza", "fecha_nacimiento", "vacuna"]

$checkboxes.forEach((element) =>
  // en el evento click, si marcan un check lo pusheo al array de keys, si lo desmarcan lo saco
  element.addEventListener("click", (e) => {
    console.log(keysOrder);
    if (e.target.checked) {
      keys.push(e.target.value);
    } else {
      keys.splice(keys.indexOf(e.target.value), 1);
    }
    // para que quede segun el orden original
    keys.sort(function (a, b) {
      return keysOrder.indexOf(a) - keysOrder.indexOf(b);
    });
    // guardo el map de anuncios con los elementos según los keys que tengo guardados
    const anunciosFiltrado = anuncios.map((item) => {
      const nuevoAnuncio = [];
      keys.forEach((key) => {
        nuevoAnuncio[key] = item[key];        
      });
      return nuevoAnuncio;
    });
    actualizarTablaFiltrada(anunciosFiltrado);
  })
);

// para traer los datos del elemento clickeado
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

$btnResetForm.addEventListener("click", () => {
  // al reseteare el formulario, cambio el texto del boton Cargar/Modificar
  $formulario.btnCargar.value = "Cargar";
  $formulario.btnCargar.classList.add("btn-success");
  $formulario.btnCargar.classList.remove("btn-primary");
  // saco los estilos de error en los inputs del form
  removerErrores();
  // escondo el boton de eliminar pq no hay nada cargado en el form
  esconderBotonEliminar();

});

$btnEliminar.addEventListener("click", (e) => {
  e.preventDefault();
  // pido confirmacion para borrar anuncio
  if (confirm("Esta por eliminar el anuncion seleccionado.")) {
    eliminarAnuncio();
    $btnResetForm.click();
  };
});

function actualizarTabla() {
  // limpio de hijos div tabla
  while ($divTabla.hasChildNodes()) {
    $divTabla.removeChild($divTabla.firstChild);
  }
  // y le meto la tabla que me crea la funcion con la data actualizada
  $divTabla.appendChild(crearTabla(anuncios));
}

function actualizarTablaFiltrada(anunciosFiltrado) {
  // limpio de hijos div tabla
  while ($divTabla.hasChildNodes()) {
    $divTabla.removeChild($divTabla.firstChild);
  }
  // y le meto la tabla que me crea la funcion con la data actualizada
  $divTabla.appendChild(crearTabla(anunciosFiltrado));
}

function eliminarAnuncio() {
  // deleteAnuncio(idSeleccionado);
  deleteAnuncioAsync(idSeleccionado);
  esconderBotonEliminar();
}

function modificarAnuncio(anuncio) {
  // asigno en anuncio los valores que estan cargados en el form
  anuncio.titulo = $formulario.titulo.value;
  anuncio.descripcion = $formulario.descripcion.value;
  anuncio.precio = $formulario.precio.value;
  anuncio.animal = $formulario.animal.value;
  anuncio.raza = $formulario.raza.value;
  anuncio.fecha_nacimiento = $formulario.fecha_nacimiento.value;
  anuncio.vacuna = $formulario.vacuna.value;
}

function cargarFormulario(anuncio) {
  // cargo en el form los valores del anuncio seleccionado
  $formulario.titulo.value = anuncio.titulo;
  $formulario.descripcion.value = anuncio.descripcion;
  $formulario.precio.value = anuncio.precio;
  $formulario.animal.value = anuncio.animal;
  $formulario.raza.value = anuncio.raza;
  $formulario.fecha_nacimiento.value = anuncio.fecha_nacimiento;
  $formulario.vacuna.value = anuncio.vacuna;
}

function validarFormVacio() {
  if ($formulario.titulo.value == "" ||
    $formulario.descripcion.value == "" ||
    $formulario.precio.value == "" ||
    $formulario.animal.value == "" ||
    $formulario.raza.value == "" ||
    $formulario.fecha_nacimiento.value == "" ||
    $formulario.vacuna.value == "") {
    return true;
  }
  return false;
}

function validarSubmit() {
  const controles = $formulario.elements;
  // me fijo si alguno de los controles del formuario tiene la clase de error
  for (const control of controles) {
    if (control.classList.contains("inputError")) {
      console.log("Hay alguna validacion que no pasa");
      return false;
    }
  }
  return true;
}

function esconderBotonEliminar() {
  $btnEliminar.classList.remove("visible");
  $btnEliminar.classList.add("invisible");
}

function mostrarBotonEliminar() {
  $btnEliminar.classList.add("visible");
  $btnEliminar.classList.remove("invisible");
}


// ---------------- Validaciones ---------------- //

// me traigo referencia a los elementos del form
const controles = $formulario.elements;

for (let i = 0; i < controles.length; i++) {
  const control = controles.item(i);
  // si alguno es input   
  if (control.matches("input")) {
    // si alguno es numero o texto
    if (control.matches("[type=text]") || control.matches("[type=number]")) {
      // valido campo vacio
      control.addEventListener("blur", validarCampoVacio);

      // me fijo la longitud del titulo y la descripcion
      if (control.matches("[id=txtTitulo]") || control.matches("[id=txtDescripcion]")) {
        control.addEventListener("input", validarLongitudMaxima);
        // pregunto por el del precio
      } else if (control.matches("[id=txtPrecio]")) {
        // y valido en input y en blur
        control.addEventListener("input", validarPrecio);
        control.addEventListener("blur", validarPrecio);
        // pregunto por los de numeros
      } else if (control.matches("[type=number]")) {
        // y valido en input y en blur
        control.addEventListener("input", validarNumero);
        control.addEventListener("blur", validarNumero);
      }
    }
  }
}

function removerErrores() {
  for (let i = 0; i < controles.length; i++) {
    const control = controles.item(i);
    // si alguno es input   
    if (control.matches("input")) {
      if (control.matches("[type=text]") || control.matches("[type=number]")) {
        const $small = control.nextElementSibling;
        $small.textContent = "";
        control.classList.remove("inputError");
        control.classList.remove("danger");
      }
    }
  }
}

