import array from "./public/js/db/Database.js";

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
        },

        eq(a, b, c) {
            return a === b || a === c;
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
    res.render("home", {
        title: "Panificadora Bakery",
        page: "home"
    });
});

app.post("/removeAllItems", (req, res) => {
    /* Removendo todos os itens do carrinho da sessão */
    req.session.carrinho = []

    res.json({
        status: 200,
    })
})

app.post("/searchProduct", (req, res) => {
    if (!req.session.carrinho) {
        req.session.carrinho = [];
    };

    const {
        nameProduct
    } = req.body;

    /* Rota para procurar o produto no carrinho para apagar ou decrementar a quantidade do item no carrinho de compras */
    const produto = req.session.carrinho.find((element) => element.produto === nameProduct);

    /* Achando o índice do elemento no carrinho de compras */
    const index = req.session.carrinho.findIndex((element) => element.produto === nameProduct);

    if (!produto) return;

    if (produto.quantidade == 1) {
        req.session.carrinho.splice(index, 1);

        res.json({
            param: "remover",
            tamanhoCarrinho: req.session.carrinho.length,
            status: 200,
        });
    } else {
        produto.quantidade --;
        req.session.save();

        res.json({
            param: "decrementado",
            produto: produto,
            status: 200
        })
    }
})

app.post("/contCart", (req, res) => {
    if (!req.session.carrinho) {
        req.session.carrinho = [];
    }

    res.json({ tamanhoCarrinho: req.session.carrinho.length })
})


app.post("/addCart", (req, res) => {
    if (!req.session.carrinho) {
        req.session.carrinho = [];
    }

    const {
        nomeProduto,
        quantProduto
    } = req.body;

    try {
        /* Procurando se o produto existe no sistema */
        const produto = array.find(element => element.produto === nomeProduto);

        /* Condição se caso o produto não existir no sistema */
        if (!produto) {
            console.log(`Este produto ${produto} não existe no sistema!`);
            return res.status(100).json({ status: 100, message: "Produto não encontrado no sistema!" });
        }

        /* Obtendo o preço unitário do produto */
        const precoUnitario = produto.precoUnitario;

        /* Verificando se o produto no carrinho de compras existe */
        const produtoExisteOuNao = req.session.carrinho.find(element => element.produto === nomeProduto);

        if (produtoExisteOuNao) {
            /* Se o produto existir no carrinho de compras então some a quantidade já existente com a quantidade. */

            produtoExisteOuNao.quantidade += quantProduto;
        } else {
            if (req.session.carrinho.length == 10) {
                return res.json({ 
                    message: "Tamanho do carrinho máximo atingido!", 
                    status: 100,
                });
            }

            /* Se o produto não existir então crie o objeto correspondente ao produto no carrinho de compras */
            req.session.carrinho.push({
                produto: nomeProduto,
                precoUnitario: precoUnitario,
                quantidade: quantProduto,
                /* Passando o tamanho do carrinho para o contCart() */
            });
        }

        res.json({ 
            tamanhoCarrinho: req.session.carrinho.length, 
            status: 200 
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Erro no servidor",
            status: 500,
        });
    }
});

app.post("/loadCart", (req, res) => {
    if (!req.session.carrinho) {
        req.session.carrinho = [];
    }

    res.json({
        carrinho: req.session.carrinho,
        subTotal: req.session.carrinho.reduce((acumulador, valorAtual) => {
            return acumulador + valorAtual.quantidade * valorAtual.precoUnitario
        }, 0)
    });

})


app.listen(port, () => {
    console.log("Servidor iniciado na porta:", port)
})