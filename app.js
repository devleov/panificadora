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
import Database from "./public/js/db/Database.js";

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

app.get("/carrinho", (req, res) => {
    res.render("layouts/cart", {
        title: "Carrinho de compras",
        page: "cart",
        layout: false,
    });
});

const Coupon = [
    {
        name_coupon: "CLIENTE10",
        value_coupon: 5,
    },
    {
        name_coupon: "1DESCONTO",
        value_coupon: 2,
    }
];

app.post("/consultCep", async (req, res) => {
    try {
        const cep = req.body.cep;

        const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await resp.json();

        if (!data) {
            return res.json({ message: "Este cep está inválido ou expirado.", status: 400 });
        }

        if (data.localidade !== "Riolândia") {
            return res.json({ message: "Não entregamos nesta localidade..", status: 400 });
        }

        res.json({ message: "CEP encontrado com sucesso!", status: 200 })
        req.session.cepActived = req.body.cep.toUpperCase();
    } catch (err) {
        console.error(err);
        return res.json({ message: "Houve um erro de servidor..", status: 500 });
    }
});

app.post("/activeCoupon", (req, res) => {
    try {
        const coupon = req.body.coupon;

        const val = Coupon.find((cou) => cou.name_coupon.toLowerCase() === coupon.toLowerCase());
        if (!val) {
            return res.json({ message: "Este cupom está inválido ou expirado.", status: 400 })
        }

        res.json({ message: "Cupom ativado com sucesso!", value_coupon: val.value_coupon, status: 200 })
        req.session.couponActived = req.body.coupon.toUpperCase();
    } catch (err) {
        console.error(err);
        return res.json({ message: "Houve um erro de servidor..", status: 500 });
    }
});

app.post("/validationID", (req, res) => {
    try {
        const dataValidation = [];

        if (!req.body) return res.json({ message: "Não existe corpo na requisição!" });

        const { arrayStorage } = req.body;

        if (!typeof arrayStorage === "object") {
            return res.json({ message: "O corpo precisa ser um objeto!" });
        }

        for (let i = 0; i < arrayStorage.length; i++) {

            const id = parseInt(arrayStorage[i].id);

            /* Verificando existência de ID no banco de dados */
            const existentID = Database.find((el) => el.id === id);

            /* Não houve retorno, não existe no banco, logo bloqueado, e apagado do localStorage */
            if (existentID) {
                const imagem = existentID.imagem;
                const produto = existentID.produto;
                const precoUnitario = existentID.precoUnitario;
                const quantidade = arrayStorage[i].qtd;

                dataValidation.push({ id, imagem, produto, precoUnitario, quantidade });
            } else {
                dataValidation.push({ id, blocked: true })
            };
        };

        res.json(dataValidation).status(200);
    } catch (err) {
        return res.json({ message: "Houve um erro de servidor", err })
    }

});

app.listen(port, () => {
    console.log("Servidor iniciado na porta:", port)
})