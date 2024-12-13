const express = require("express")
const app = express();
const path = require("path");

// Rotas dos produtos 
const products = require("./router/products");
app.use("/produtos", products);

// Configuração do express-handlebars
const { engine } = require("express-handlebars");

app.engine("hbs", engine({
    defaultLayout: "main",
    extname: "hbs",
    partialsDir: "views/partials",
    layoutsDir: "views/layouts"
}));

app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("home", {
        title: "Panificadora Bakery",
        page: "home"
    })
})

app.listen(9091, () => {
    console.log("Servidor iniciado na porta 9091.")
})