const modal_cart_shopping = document.getElementById("modal-cart-shopping");
import LoadCart from "./loadCart.js"

export default function abrirCarrinho() {
    modal_cart_shopping.classList.add("open");
    LoadCart();
}

window.abrirCarrinho = abrirCarrinho;