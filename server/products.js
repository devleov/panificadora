import arrayProducts from "../public/js/db/Database.js";
import shuffleArray from "../public/js/db/Shuffle.js";

export default function handler(req, res) {
    const { category, produto, categoria } = req.query;

    if (category && produto) {
        // Quando o usuário entra em um produto específico
        const btnUrlBack = `/produtos/${category}`;
        const urlProduct = produto;

        // Produto que foi acessado
        const product = arrayProducts.filter((element) => element.categoria == category && element.url_produto == urlProduct);

        const array = arrayProducts.filter((element) => element.especificidade == product[0].especificidade && element.categoria == product[0].categoria && element.produto !== product[0].produto);
        const itemSuggestion = shuffleArray(array).slice(0, 4);

        res.render("produto", {
            item: (category == "paes" ? (category = "pães").charAt(0).toUpperCase() + category.slice(1) : category.charAt(0).toUpperCase() + category.slice(1)),
            title: product[0].produto,
            produto: product,
            btnUrlBack: btnUrlBack,
            itemSuggestion: itemSuggestion,
            layout: "item"
        });
    } else if (categoria) {
        // Filtrando pela categoria
        const produtos = arrayProducts.filter(element => element.categoria == categoria);

        res.render(categoria, {
            item: (categoria == "paes" ? (categoria = "pães").charAt(0).toUpperCase() + categoria.slice(1) : categoria.charAt(0).toUpperCase() + categoria.slice(1)),
            layout: "products",
            category: categoria,
            section: (categoria == "bolos" || categoria == "salgados" ? categoria + ".avif" : categoria + ".jpg"),
            items: produtos,
        });
    } else {
        res.status(400).json({ message: "Invalid request" });
    }
}