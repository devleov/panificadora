import express from "express";
import path from "path";

const app = express();
const port = 9091

// Rotas dos produtos 
import router from "./router/products.js";
app.use("/produtos", router);

// Configuração do express-handlebars
import { engine } from "express-handlebars";

app.engine("hbs", engine({
    helpers: {
        formatCurrency(value) {
            return value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });
        },
        
        lengthArray(array) {
            return array.length;
        }
    },
    defaultLayout: "main",
    extname: "hbs",
    partialsDir: "views/partials",
    layoutsDir: "views/layouts"
}));

app.set("view engine", "hbs");

app.use(express.static(path.join("public")));


const cart = []; // Carrinho de compras.
export default cart;

app.post("/addCart", (req, res) => {
    const item = req.body.item;
    cart.push(item);
    res.json({ message: `Item: ${item} adicionado no carrinho!` })
})

app.get("/", (req, res) => {
    res.render("home", {
        title: "Panificadora Bakery",
        page: "home"
    })
})

app.listen(port, () => {
    console.log("Servidor iniciado na porta:", port)
})