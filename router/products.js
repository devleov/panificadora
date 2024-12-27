import express from "express";
import arrayProducts from "../public/js/db/array.js";
const router = express.Router();

router.get("/:categoria", (req, res) => {
    let categoria = req.params.categoria;

    /* Filtrando pela categoria */
    const produtos = arrayProducts.filter(element => element.categoria == categoria)

    if (categoria == "paes") {
        categoria = categoria.replace("a", "ã")
    }

    res.render(categoria, {
        item: categoria.charAt(0).toUpperCase() + categoria.slice(1),
        layout: "products",
        section: (categoria == "bolos" || categoria == "salgados" ? categoria + ".avif" : categoria + ".jpg"),
        items: produtos,
    })

})

export default router;