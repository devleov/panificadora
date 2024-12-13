const express = require("express");
const router = express.Router();


router.get("/paes", (req, res) => {
    res.render("paes", { title: "Seção de Pães - Panificadora Bakery" })
})

router.get("/bolos", (req, res) => {
    res.send("Página da seção de bolos")
})

router.get("/gelados", (req, res) => {
    res.send("Página da seção de gelados")
})

router.get("/salgados", (req, res) => {
    res.send("Página da seção de salgados")
})

router.get("/doces", (req, res) => {
    res.send("Página da seção de doces")
})


module.exports = router;