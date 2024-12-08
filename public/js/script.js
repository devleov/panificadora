const txt_dinamic = document.getElementById("txt-dinamic");

const array = [
    "com o frescor de cada manhã!",
    "direto do forno para você!",
    "trazendo momentos deliciosos!"
];

/* Variáveis de controle */
let indexLetters = 0; // Índice referente ao caracter no array.
let index = 0; // Índice referente ao elemento no array.
let sentence = ""; // String referente a frase no texto dinâmico.
let interval = false; // Bloqueio para execução do código.

let intervalCaracter;
let intervalEspera;

if (index < array.length) { // Se não percorremos o array por completo, execute.

    if (!interval) intervalCaracter = setInterval(escrevaCaracter, 150);

    function escrevaCaracter() {
        if (indexLetters < array[index].length) {
            sentence = array[index][indexLetters]
            txt_dinamic.textContent += sentence;

            indexLetters++;
        } else {
            interval = true;

            clearInterval(intervalCaracter);

            txt_dinamic.classList.add("espera");
            intervalEspera = setTimeout(tempoDeEspera, 5000);
        }
    }

    function tempoDeEspera() {
        setTimeout(() => {
            txt_dinamic.classList.remove("espera");
        }, 1700)

        setTimeout(() => {
            index++;
            indexLetters = 0;
            sentence = "";

            txt_dinamic.textContent = "";

            if (index >= array.length) {
                index = 0;
            }

            interval = false;

            intervalCaracter = setInterval(escrevaCaracter, 150);

        }, 2000)

        intervalEspera = clearTimeout(tempoDeEspera)
    }
}



/* Configuração do carrinho de compras */

import OpenCart from './cart/openCart.js';
import CloseCart from './cart/closeCart.js';
import ContCart from './cart/contCart.js';
import LoadCart from './cart/loadCart.js';

const cart = [];
export default cart;
window.cart = cart;

function initializeCart() {
    const btn_cart_shopping = document.getElementById("cart-shopping");
    const modal_cart_shopping = document.getElementById("modal-cart-shopping");
    const modal_cart_items = document.getElementById("modal-cart-items");
    const cart_modal_btn_buy = document.getElementById("cart-modal-btn-buy");
    const box_menu_items = document.getElementById("box-menu-items")

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


    document.getElementById("menu").addEventListener("click", () => {
        if (!box_menu_items.classList.contains("show")) {
            box_menu_items.classList.add("show");
            return;
        }

        box_menu_items.classList.remove("show");
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
