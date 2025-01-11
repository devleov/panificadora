import array from "./array.js";

function normalizeString(string) {
    return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export default function searchName(category, nameProduct) {
    let data;

    if (nameProduct == undefined) {
        return data = array.filter(item => item.categoria == category);
    }

    data = array.filter((element) => element.categoria == category && normalizeString(element.produto).includes(normalizeString(nameProduct)));

    if (!data.length) {
        return "Não há nenhum item retornado!";
    };

    return data;
}