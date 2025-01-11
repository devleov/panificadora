import express from "express";
import arrayProducts from "../public/js/db/array.js";

import shuffleArray from "../public/js/db/Shuffle.js"

const router = express.Router();

router.get("/:category/:produto", (req, res) => {
    /* Quando o usuário entra em um produto específico */
    let category = req.params.category;
    const btnUrlBack = `/produtos/${category}`;
    const urlProduct = req.params.produto;

    /* Produto que foi acessado */
    const product = arrayProducts.filter((element) => element.category == category && element.url_produto == urlProduct);

    const array = arrayProducts.filter((element) => element.especificidade == product[0].especificidade && element.id !== product[0].id)
    const itemSuggestion = shuffleArray(array).slice(0, 4);

    res.render("produto", {
        item: (category == "paes" ? (category = "pães").charAt(0).toUpperCase() + category.slice(1) : category.charAt(0).toUpperCase() + category.slice(1)),
        title: product[0].produto,
        produto: product,
        btnUrlBack: btnUrlBack,
        itemSuggestion: itemSuggestion,
        layout: "item"
    })
})

router.get("/:categoria", (req, res) => {
    let category = req.params.categoria;

    /* Filtrando pela categoria */
    const produtos = arrayProducts.filter(element => element.categoria == category) 

    res.render(category, {
        item: (category == "paes" ? (category = "pães").charAt(0).toUpperCase() + category.slice(1) : category.charAt(0).toUpperCase() + category.slice(1)),
        layout: "products",
        category: req.params.categoria,
        section: (category == "bolos" || category == "salgados" ? category + ".avif" : category + ".jpg"),
        items: produtos,
    })

})

export default router;