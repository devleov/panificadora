import cart from "../pages/home/script.js";
import loadCart from "./loadCart.js";
import contCart from "./contCart.js";

const produtosLoja = [
    {
        produto: "Pão Francês",
        precoUnitario: 1.00
    },
    {
        produto: "Pão Doce",
        precoUnitario: 1.99
    }
]

export default function adicionarItem(produto, quant) {

    const item = produtosLoja.find(element => element.produto === produto);

    if (!item) {
        console.log(`Este produto ${produto} não existe!`)
    }

    const itemExistente = cart.find(element => element.produto === produto);

    if (itemExistente) {
        itemExistente.quantidade += quant;
        loadCart();

        return;
    }

    cart.push({
        produto: produto,
        precoUnitario: item.precoUnitario,
        quantidade: quant
    })

    loadCart();
    contCart();

}

window.adicionarItem = adicionarItem;