const URL = "http://localhost:3000/anuncios";

const divSpinner = document.getElementById("spinner");

export const getAnunciosAsync = async () => {
  try {
    setSpinner(divSpinner, "../client/img/spinner.gif");
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

export const deleteAnuncioAsync = async (idSeleccionado) => {
  try {
    setSpinner(divSpinner, "../client/img/spinner.gif");
    const res = await fetch(URL + `/${idSeleccionado}`, {
      method: "DELETE",
    });
    if (!res.ok) { throw new Error(`Error: ${res.status} - ${res.statusText} `) }
    //console.log(data);
  } catch (error) {
    console.error(err);
  }
  finally {
    clearSpinner(divSpinner);
  }
};

export const createAnuncio = (anuncio) => {
  setSpinner(divSpinner, "../client/img/spinner.gif");
  fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(anuncio),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject(`Error: ${res.status} - ${res.statusText}`)
      }
      console.log(res);
    })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      clearSpinner(divSpinner);
    })
};

export const updateAnuncio = (anuncio) => {
  setSpinner(divSpinner, "../client/img/spinner.gif");
  fetch(URL + `/${anuncio.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(anuncio),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject(`Error: ${res.status} - ${res.statusText}`)
      }
      console.log(res);
    })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      clearSpinner(divSpinner);
    })
};

export const deleteAnuncio = (idSeleccionado) => {
  setSpinner(divSpinner, "../client/img/spinner.gif");
  fetch(URL + `/${idSeleccionado}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject(`Error: ${res.status} - ${res.statusText}`)
      }
      console.log(res);
    })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      clearSpinner(divSpinner);
    })
};

export const setSpinner = (div, src) => {
  const img = document.createElement("img");
  img.setAttribute("src", src);
  img.setAttribute("alt", "spinner");
  img.setAttribute("class", "rounded mx-auto d-block");
  div.appendChild(img);
};

export const clearSpinner = (div) => {
  while (div.hasChildNodes()) {
    div.removeChild(div.firstElementChild);
  }
}