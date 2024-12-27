/* Configuração do carrinho de compras */

import OpenCart from '../../cart/openCart.js';
import CloseCart from '../../cart/closeCart.js';
import ContCart from '../../cart/contCart.js';
import LoadCart from '../../cart/loadCart.js';

const cart = [];
export default cart;
window.cart = cart;

function initializeCart() {
    const btn_cart_shopping = document.getElementById("cart-shopping");
    const modal_cart_shopping = document.getElementById("modal-cart-shopping");
    const modal_cart_items = document.getElementById("modal-cart-items");
    const cart_modal_btn_buy = document.getElementById("cart-modal-btn-buy");

    btn_cart_shopping.addEventListener("click", () => {
        OpenCart();
    });

    modal_cart_shopping.addEventListener("click", (event) => {
        const temClasse = (classe) => event.target.classList.contains(classe);

        if (temClasse("modal-cart-shopping") || temClasse("modal-btn-close")) {
            CloseCart();
        }

        if (temClasse("remove-btn-item")) {
            const cartItem = event.target.closest(".cart-item") // Buscando o item do carrinho correspondente ao botão de remover o item;
            const productName = cartItem.querySelector("#product-name"); // Procura o id `.product-name` no elemento filho do elemento `cartItem`;

            const productRemove = cart.find((element) => {
                return element.produto == productName.innerHTML; // Achando o elemento que está no carrinho de compras no array `cart` de acordo com o nome registrado no carrinho;
            });

            if (productRemove.quantidade > 1) {
                productRemove.quantidade -= 1;
            } else {
                cartItem.remove();
                const index = cart.indexOf(productRemove);
                cart.splice(index, 1);
                ContCart();
            }

            LoadCart();
        }
    });

    cart_modal_btn_buy.addEventListener("click", () => {
        const input_cart_address = document.getElementById("cart-address").value;

        if (!input_cart_address) {
            alert("Input vazio");
            return;
        }

        alert("Input com conteúdo");
    });


    cart_modal_btn_buy.disabled = true; // Inicia com o botão desligado já que estará sem conteúdo.
    cart_modal_btn_buy.classList.add("cart_modal_btn_buy_disabled"); // Atribui características ao botão desligado.
    modal_cart_items.classList.add("empty"); // Atribui propriedades de preenchimento e margem no carrinho para melhor visualização.

    const observer = new MutationObserver(() => {
        if (modal_cart_items.innerHTML == "") {
            cart_modal_btn_buy.disabled = true;
            modal_cart_items.classList.add("empty");
            cart_modal_btn_buy.classList.add("cart_modal_btn_buy_disabled");
        } else {
            cart_modal_btn_buy.disabled = false;
            modal_cart_items.classList.remove("empty");
            cart_modal_btn_buy.classList.remove("cart_modal_btn_buy_disabled");
        }
    });

    observer.observe(modal_cart_items, { childList: true, subtree: true });

    ContCart();

}

document.addEventListener("DOMContentLoaded", initializeCart);
