import express from "express";
import path from "path";

const app = express();
const port = 9091;

// Configurando a sessão
import session from "express-session";
app.use(session({
    secret: "meuincrivelpan",
    saveUninitialized: true,
    resave: true,
    cookie: {
        secure: false,
        sameSite: "lax",
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


/* CÓDIGOS DE DESCONTO */
const Coupon = [
    { name_coupon: "CLIENTE10", value_coupon: 5 },
    { name_coupon: "1DESCONTO", value_coupon: 2 }
];

app.get("/", (req, res) => {
    res.render("welcome", {
        title: "Panificadora Bakery",
        page: "welcome",
    });
});

app.get("/login", (req, res) => {
    res.render("login", {
        title: "Entrar - Panificadora Bakery",
        page: "login",
        layout: "enter",
    });
});

app.get("/cadastro", (req, res) => {
    res.render("register", {
        title: "Registre-se - Panificadora Bakery",
        page: "register",
        layout: "enter",
    });
});

app.get("/carrinho", (req, res) => {
    /* Reseta o estado do cep, cupom e autorização para acessar o /pagamento se o usuário recarrega a página */
    req.session.cepActived = false;
    req.session.couponActived = false;

    res.render("layouts/cart", {
        title: "Carrinho de compras",
        page: "cart",
        layout: false,
    });
});

app.get("/pagamento", (req, res) => {
    if (!req.session.accessEntrance) return res.redirect("/carrinho");

    req.session.accessEntrance = false;

    res.render("layouts/payment", {
        /* Envia todas as informações de CEP para o front-end */
        cep_address: req.session.infoCep.cep,
        road_address: req.session.infoCep.road,
        delivery_address: req.session.infoCep.delivery_address,
        number_address: req.session.infoCep.number_address,
        building_address: req.session.infoCep.building_address,

        layout: false,
    });
});

app.post("/updateInfoCep", (req, res) => {
    try {
        const { delivery_address, number_address, building_address, reference_address } = req.body;

        /* Obtendo os novos valores e salvando na sessão do usuário */
        const infoCep = req.session.infoCep = {
            ...req.session.infoCep,
            delivery_address, /* Endereço de entrega */
            number_address, /* Número do endereço */
            building_address, /* (Complemento) Prédio do endereço */
            reference_address, /* Referência em relação ao endereço */
        };

        res.json({ status: 200, message: "Atualizou as informações com sucesso!" });
    } catch (err) {
        res.json({ status: 400, message: "Algo deu errado em atualizar as informações do cep!" })
        console.error(err);
    }
});

/* Cria o cliente com as informações de cobrança */
app.post("/consumer/create", async (req, res) => {

    const { name, cellphone, email, taxId } = req.body;

    const url = 'https://api.abacatepay.com/v1/customer/create';

    const resp = await fetch(url, {
        method: "POST",
        headers: { Authorization: "Bearer abc_dev_4Hupr2f13gPqQkxc6uZSSAdf", "Content-Type": "application/json" },
        body: JSON.stringify({ name, cellphone, email, taxId }),
    });

    const data = await resp.json();

    return res.json(data);
});

/* Cria uma cobrança PIX nome do usuário inserido */
app.post("/pixQrCode/create", async (req, res) => {

    const { name, cellphone, email, taxId, amount } = req.body;

    const url = 'https://api.abacatepay.com/v1/pixQrCode/create';

    const resp = await fetch(url, {
        method: "POST",
        headers: { Authorization: "Bearer abc_dev_4Hupr2f13gPqQkxc6uZSSAdf", "Content-Type": "application/json" },
        body: JSON.stringify({ amount, expiresIn: 120, name, cellphone, email, taxId }),
    });

    const data = await resp.json();

    return res.json(data);
});

app.post("/activeCoupon", (req, res) => {
    try {
        const { coupon } = req.body;

        const val = Coupon.find((cou) => cou.name_coupon.toLowerCase() === coupon.toLowerCase());
        if (!val) {
            return res.json({ message: "Este cupom está inválido ou expirado.", status: 400 })
        }

        req.session.infoCoupon = {
            coupon: req.body.coupon.toUpperCase(),
            value_coupon: val.value_coupon,
        }

        req.session.couponActived = true;

        res.json({ message: "Cupom ativado com sucesso!", value_coupon: val.value_coupon, status: 200 });
    } catch (err) {
        console.error(err);
        return res.json({ message: "Houve um erro de servidor..", status: 500 });
    }
});

/* Localizações que a empresa entrega */
const locationsDelivery = [
    {
        location: "Riolândia",
        delivery_price: 2,
    },
    {
        location: "Paulo de Faria",
        delivery_price: 9,
    },
    {
        location: "Cardoso",
        delivery_price: 6,
    },
]

app.post("/consultCep", async (req, res) => {
    try {
        const { cep } = req.body;

        const resp = await fetch(`https://cep.awesomeapi.com.br/json/${cep}`);

        const data = await resp.json();

        if (data && data.erro == "true") {
            if (req.session.cepActived === true) {
                req.session.cepActived = false;
            }

            return res.json({ message: "Este cep está inválido ou expirado.", status: 400 });
        }

        const locationValidated = locationsDelivery.find((loc) => loc.location.toLowerCase() == data.city.toLowerCase());

        if (!locationValidated) {
            if (req.session.cepActived === true) {
                req.session.cepActived = false;
            }

            return res.json({ message: "Não entregamos nesta localidade..", status: 400 });
        }

        /* Guarda o CEP do usuário e o preço de delivery referente ao CEP, para validações */
        req.session.infoCep = {
            cep,
            road: data.address,
            delivery_price: locationValidated.delivery_price,
        };

        req.session.cepActived = true;

        res.json({ message: "CEP encontrado com sucesso!", delivery_price: locationValidated.delivery_price, status: 200 });
    } catch (err) {
        console.error(err);
        return res.json({ message: "Houve um erro de servidor..", status: 500 });
    }
});

/* Valida o pedido, verificando se o cupom de desconto é válido e o frete */
app.post("/orderValidation", async (req, res) => {
    try {
        const { cartItems } = req.body;

        const { infoCep, infoCoupon, cepActived, couponActived } = req.session;

        let total = 0;

        if (cartItems && cartItems.length == 0 || !cartItems) return res.json({ message: "Não existe itens no carrinho..", status: 400 });
        if (!cepActived) return res.json({ message: "Insira um cep válido, por favor.", status: 400 });

        if (couponActived === true) {
            /* Soma o valor do cupom referente ao cupom de desconto */
            total -= infoCoupon.value_coupon;
        }

        /* Soma o valor do frete referente ao CEP */
        total += infoCep.delivery_price;

        /* Percorre todos os itens validados e soma seus valores */
        cartItems.forEach((el) => {
            total += parseFloat(el.precoUnitario) * parseInt(el.quantidade)
        });

        // total = total.toString();
        // total = total.replace(".", "");
        // total = parseInt(total);

        // /* Cria o QR CODE para pagamento */
        // const resp = await fetch("http://localhost:9091/pixQrCode/create", {
        //     method: "POST",
        //     headers: { "Content-type": "application/json" },
        //     body: JSON.stringify({
        //         amount: total,
        //         name: "Léo Vitor",
        //         cellphone: "17981467337",
        //         email: "lindinaldo.martins@gmail.com",
        //         taxId: "529.726.878-84"
        //     }),
        // });

        // const data = await resp.json();

        // if (data) {
        // const imgQr = data.data.brCodeBase64;
        // const copyAndPaste = data.data.brCode;

        /* Autoriza o usuário acessar a rota de pagamento */
        req.session.accessEntrance = true;

        res.json({ status: 200 });
        // }

    } catch (err) {
        console.error(err);
        return res.json({ message: "Houve algum erro na validação do pedido!" });
    }
});

app.post("/idValidation", (req, res) => {
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