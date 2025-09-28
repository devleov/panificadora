import Database from "../../db/Database.js";

/* ================================
   FUNCIONAMENTO DOS BOTÕES + & - QUANTIDADE
   ================================ */
export default function changePriceEnd(productClicked) {
    // Pega o item (produto) clicado
    const item = productClicked.target.closest(".item");

    // Input de quantidade
    const inputQtd = item.querySelector(".input-qtd");

    // Campo de preço no card
    const price = item.querySelector(".card-item-price") ? item.querySelector(".card-item-price") : item.querySelector(".total-item-cart-shopping");

    // Produto correspondente no "banco de dados"
    const product = Database.find((el) => el.id == item.id);

    // Preço unitário
    const priceUn = product.precoUnitario;

    // Quantidade atual
    let currentQtd = parseInt(inputQtd.value);

    // Incrementa ou decrementa
    if (productClicked.target.classList.contains("qtd-add")) currentQtd++;
    if (productClicked.target.classList.contains("qtd-rem") && currentQtd > 1) currentQtd--;

    // Atualiza quantidade no front-end
    inputQtd.value = currentQtd;

    // Calcula preço final
    const priceEnd = priceUn * currentQtd;

    // Mostra preço atualizado no front-end
    $(price).text(priceEnd.toLocaleString("pt-br", {
        currency: "BRL",
        style: "currency"
    }));

    // Se estiver no carrinho (offcanvas) ou na página dos produtos do carrinho de compras, atualizar diretamente o subTotal, e para isso, atualiza-se o localStorage
    if (item.closest(".offcanvas") || item.closest(".box-product-cart")) {
        localStorage.setItem(item.id, inputQtd.value);
    }
}