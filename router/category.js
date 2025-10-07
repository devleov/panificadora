import express from "express";
import Database from "../public/js/db/Database.js";
import shuffleArray from "../public/js/func/shuffle.js";

const router = express.Router();

/* Quando o usuário entra em um produto específico */
router.get("/:category/:urlProduct", (req, res) => {
    const { category, urlProduct } = req.params;

    console.log(category, urlProduct)

    /* Obtém o produto acessado no banco de dados */
    const dataProduct = Database.find((element) => element.categoria == category && element.url_produto == urlProduct);

    if (!dataProduct) {
        return res.send("Desculpe, este produto não existe em nossa loja!")
    }

    /* Obtém produtos semelhantes ao que foi acessado */
    const similarProducts = Database.filter((element) => element.especificidade == dataProduct.especificidade && element.categoria == dataProduct.categoria && element.produto !== dataProduct.produto);

    /* Embaralha os produtos semelhantes ao que foi acessado */
    const itemSuggestion = shuffleArray(similarProducts).slice(0, 4);

    res.render("layouts/product", {
        product: dataProduct.produto,
        category: category,
        item: dataProduct,
        itemSuggestion: itemSuggestion,
        layout: false,
    })
})

/* Quando o usuário entra em uma categoria específica */
router.get("/:category", (req, res) => {
    const { category } = req.params;

    const maxQtdShow = Database[Database.length - 1].maxQtdShow;

    /* Filtrando pela categoria */
    const items = Database.filter(element => element.categoria == category).slice(0, maxQtdShow);

    /* Aqui, eu carrego o layout como se fosse o template para não precisar carregar o template, eu fiz isso por que, como categoria, é algo que muda, preciso fazer com que o "template" que estou colocando abaixo, e percebi que nos templates que seriam eu não precisava colocar nada dentro de especial que fizesse que criasse um template diferente para cada categoria. */

    res.render("layouts/section", {
        layout: false,
        img_category: `/assets/imgs/pages/welcome/products/${category}.jpg`,
        category,
        items,
    });

})

export default router;