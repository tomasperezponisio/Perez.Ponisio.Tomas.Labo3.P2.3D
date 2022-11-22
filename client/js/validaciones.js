
export const validarCampoVacio = (e) => {
    const input = e.target;
    input.value.trim() ? clearError(input) : setError(input, "Campo requerido");
};

export const validarPrecio = (e) => {
    const input = e.target;
    const numero = input.value.trim();
    const pattern = /[^a-z ]\ *([.0-9])*\d/g;
    
    if (pattern.test(numero)){
        parseInt(numero);
        if (numero > 0 && numero < 50000){
            clearError(input);
        } else {
            setError(input, "El precio debe ser mayor a 0 y menor a 50.000");
        }        
    } else {
        setError(input, "Número invalido");
    }
};

export const validarNumero = (e) => {
    
    const input = e.target;
    const numero = parseInt(input.value.trim());
    if (numero > 0 && numero < 11)
    {
        clearError(input);
    } else {
        setError(input, "La cantidad debe estar entre 0 y 10");
    }
};

export const validarLongitudMaxima = (e) => {
    
    const input = e.target;
    const texto = input.value.trim();
    
    if (texto.length < 25) {
        clearError(input); 
    } else {
        setError(input, "Debe tener menos de 25 caracteres");
    }
};

const setError = (input, mensaje) => {
    const $small = input.nextElementSibling;
    $small.textContent = mensaje || `${input.name} requerido`;
    input.classList.add("border-danger");
    $small.classList.add("danger", "text-danger", "fw-bold");
};

const clearError = (input) => {
    const $small = input.nextElementSibling;
    $small.textContent = "";
    input.classList.remove("border-danger");
    $small.classList.remove("danger", "text-danger", "fw-bold");
};
