

export const promedio = (anuncios, parametro) => {
    let total;
    let totalAnimal;
    if (parametro == "todos") {
        total = anuncios.reduce((total, a) => {
            return total += parseFloat(a.precio);
        }, 0);        
        return (total / anuncios.length).toFixed(2);
    } else {
        totalAnimal = anuncios.filter(p => p.animal == parametro);        
        total = totalAnimal.reduce((total, a) => {
            return total += parseFloat(a.precio);
        }, 0);
        return (total / totalAnimal.length).toFixed(2);
    }
}


