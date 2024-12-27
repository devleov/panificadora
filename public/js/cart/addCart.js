import cart from "../pages/home/script.js";
import loadCart from "./loadCart.js";
import contCart from "./contCart.js";
import arrayProducts from "../db/array.js";

export default function adicionarItem(produto, quant) {

    const item = arrayProducts.find(element => element.produto === produto);

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