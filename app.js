import express from "express";
import path from "path";

const app = express();
const port = 9091;

// Configurando a sessão
import session from "express-session";
app.use(session({
    secret: "meuincrivelpan",
    saveUninitialized: true,
    resave: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
    }
}))

app.use(express.json());

// Rotas dos produtos 
import router from "./router/category.js";
app.use("/categoria", router);

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
        },

        eq(a, b, c, d, e) {
            return a === b || a === c || a === d || a === e;
        },

        index(element, index) {
            return element[index]
        }
    },
    defaultLayout: "main",
    extname: "hbs",
    partialsDir: "views/partials",
    layoutsDir: "views/layouts"
}));

app.set("view engine", "hbs");

app.use(express.static(path.join("public")));

app.get("/", (req, res) => {
    res.render("welcome", {
        title: "Panificadora Bakery",
        page: "welcome",
    });
});

app.listen(port, () => {
    console.log("Servidor iniciado na porta:", port)
})