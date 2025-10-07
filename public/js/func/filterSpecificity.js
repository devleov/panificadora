import Database from "../db/Database.js";

/* Filtro para o uso nos filtros de especificidade e categoria na seção de filtragem nas rotas como /produtos/paes */

export default function FilterBySpecificity(category, specificity) {
    if (!category || !specificity) return;

    // Category = categoria dos produtos que deseja retornar
    // Specificity = especificidade dos produto que deseja filtrar
    // Length = quantidade de itens que quer retornar da filtragem

    let data;

    if (specificity == "todos") {
        return Database.filter(item => item.categoria == category);
    }

    data = Database.filter(item => item.categoria == category && item.especificidade == specificity);

    if (!data.length) return;

    return data;
};