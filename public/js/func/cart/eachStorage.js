/* Percorre o localStorage do cliente, validando quantidade máxima e mínima e se o valor é válido */
function eachStorage() {
    const arrayStorage = [];

    try {
        for (let i = 0; i < localStorage.length; i++) {
            const nameKey = localStorage.key(i);
            const valueKey = localStorage.getItem(nameKey);

            if (isNaN(valueKey)) {
                localStorage.removeItem(nameKey);
            };

            if (valueKey > 1001) {
                localStorage.setItem(nameKey, 1);
            };

            if (valueKey < 1 || valueKey == 0) {
                localStorage.setItem(nameKey, 1);
            }

            arrayStorage.push({ id: nameKey, qtd: valueKey });
        }

        return { message: "Percorreu o localStorage com sucesso!", arrayStorage };
    } catch (err) {
        return { message: "Houve algum problema em percorrer!", err };
    }

}