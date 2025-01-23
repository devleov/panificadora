import { engine } from "express-handlebars";

export default function handler(req, res) {
    const hbs = engine({
        defaultLayout: "main",
        extname: "hbs",
        partialsDir: "views/partials",
        layoutsDir: "views/layouts",
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
        }
    });

    res.render("home", {
        title: "Panificadora Bakery",
        page: "home"
    });
}