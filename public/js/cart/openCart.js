const modal_cart_shopping = document.getElementById("modal-cart-shopping");
const body = document.body;
import LoadCart from "./loadCart.js"

export default function abrirCarrinho() {
    modal_cart_shopping.classList.add("open");
    body.classList.add("no-scroll");

    LoadCart();
}

window.abrirCarrinho = abrirCarrinho;