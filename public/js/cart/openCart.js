import loadCart from "./loadCart.js";

export default function openCart() {
    const modal_cart_shopping = document.querySelector(".modal-cart-shopping");

    /* Incluído atribuição de classe e carregamento do carrinho */
    modal_cart_shopping.classList.add("open");

    loadCart();
}