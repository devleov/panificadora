import contCart from "./contCart.js";
import loadCart from "./loadCart.js";
import openCart from "./openCart.js";

const btn_cart_shopping = document.getElementById("cart-shopping");
const modal_cart_shopping = document.querySelector(".modal-cart-shopping");

btn_cart_shopping.addEventListener("click", () => {
    /* A função carrega o carrinho de compras */

    openCart();
});

modal_cart_shopping.addEventListener("click", async (event) => {
    const possuiClasse = (classe) => event.target.classList.contains(classe);

    /* Se o usuário clicar para fora do carrinho de compras ou no botão de fechar então feche o carrinho */
    if (possuiClasse("modal-cart-shopping") || possuiClasse("modal-btn-close")) {
        modal_cart_shopping.classList.remove("open");
    }

    if (possuiClasse("remove-btn-item")) {
        const boxContentItem = event.target.closest(".box-content-item");
        const nameProduct = boxContentItem.querySelector("#product-name").innerHTML;

        /* Procurar o produto no carrinho */
        fetch("/searchProduct", {
            method: "POST",
            body: JSON.stringify({ nameProduct: nameProduct }),
            headers: { "Content-type": "application/json" },
        }).then((resp) => resp.json()).then((data) => {
            if (data.param == "remover") {
                loadCart();
                contCart(data.tamanhoCarrinho);

                return boxContentItem.remove();
            }

            if (data.param == "decrementado") {
                loadCart();
            }
        })
    }
});
