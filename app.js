import arrayProducts from "./public/js/db/Database.js";
import express from "express";
import path from "path";
import shuffleArray from "./public/js/db/Shuffle.js";
import session from "express-session";
import { engine } from "express-handlebars";

const app = express();

// Configurando a sessão
app.use(session({
    secret: "meuincrivelpan",
    saveUninitialized: true,
    resave: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
    }
}));

// Configuração do express-handlebars
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

// Rotas da aplicação
app.get("/", (req, res) => {
    res.render("home", {
        title: "Panificadora Bakery",
        page: "home"
    });
});

// Outras rotas aqui...

// Definir a porta do servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 

// Rodando o servidor no Vercel
export default app;