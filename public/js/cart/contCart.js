const btn_cart_shopping = document.getElementById("cart-shopping");
import cart from "../pages/home/script.js";

export default function atualizarContadorCarrinho() {
    btn_cart_shopping.getElementsByTagName("span")[0].textContent = "(" + cart.length + ")";
}

window.atualizarContadorCarrinho = atualizarContadorCarrinho;