import array from "./array.js";

/* Filtro para o uso nos filtros de especificidade e categoria na seção de filtragem nas rotas como /produtos/paes */

export default function Filter(category, specificity) {
    // Category = categoria dos produtos que deseja retornar
    // Specificity = especificidade dos produto que deseja filtrar
    // Length = quantidade de itens que quer retornar da filtragem
    
    if (category == undefined || specificity == undefined) {
        return {
            data: "Não tem parâmetros suficientes na função!",
            status: 400,
        };
    }

    try {
        let data;
        
        if (specificity == "todos") {
            return {
                data: (array.filter(item => item.categoria == category).length) !== 0 ? array.filter(item => item.categoria == category) : "Não há nenhum item retornado!",
                status: 200,
            };
        }

        data = array.filter(item => item.categoria == category && item.especificidade == specificity);

        if (!data.length) {
            return {
                data: "Não há nenhum item retornado!",
                status: 100,
            };
        };
    
        return {
            data,
            status: 200,
        };
    } catch (err) {
        return {
            message: "Deu algum problema em executar a filtragem!",
            error: err,
            status: 500,
        };
    }
};