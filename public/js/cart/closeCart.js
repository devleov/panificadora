const modal_cart_shopping = document.getElementById("modal-cart-shopping");

export default function fecharCarrinho() {
    modal_cart_shopping.classList.remove("open");
}

window.fecharCarrinho = fecharCarrinho;