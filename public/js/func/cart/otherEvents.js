import Database from "../../db/Database.js";
import changeSubTotalCart from "./changeSubTotalCart.js";
import changePriceEnd from "./changePriceEnd.js";
import changeQtdCart from "./changeQtdCart.js";

/* ================================
   IMPORTAÇÃO DA FUNÇÃO DE AVISO
   ================================ */
import showToast from "../../components/warn.js";

/* ================================
   PREENCHE O CARRINHO COM LOCALSTORAGE AO ABRIR
   ================================ */
const offcanvas = document.querySelector(".offcanvas");

offcanvas?.addEventListener("show.bs.offcanvas", () => {
    let data = "";
    const box_items = document.querySelector(".box-items");

    // Para cada item no localStorage, monta o HTML correspondente
    for (let i = 0; i < localStorage.length; i++) {
        const id = localStorage.key(i);
        const value = localStorage.getItem(id);

        const item = Database.find((el) => el.id == id);

        const product = item.produto;
        const priceEnd = item.precoUnitario * value;
        const category = item.categoria;
        const url_product = item.url_produto;
        const img = item.imagem;

        data += `
            <div class="item d-flex justify-content-between align-items-center" id="${id}">
                <a href="${category}/${url_product}" style="color: black; text-decoration: none">
                    <div class="d-flex align-items-center gap-2">
                        <div>
                            <img class="rounded" src="/assets/imgs/pages/section/${img}"
                                style="max-width: 50px; max-height: 50px">
                        </div>

                        <div class="d-flex flex-column me-2">
                            <p class="fs-6 mb-0"
                                style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden; width: 130px;">
                                ${product}</p>
                            <p class="card-item-price fs-6 mb-0">${priceEnd.toLocaleString("pt-br", {
                            currency: "BRL",
                            style: "currency",
                        })}</p>
                        </div>
                    </div>
                </a>

                <div class="d-flex align-items-center">
                    <div class="d-flex justify-content-around align-items-center border rounded"
                        style="max-width: 125px;">
                        <div role="button" class="qtd-add"><i style="pointer-events: none;"
                                class="px-2 fa-solid fa-plus"></i></div>

                        <input min="1" type="text" value="${value}" class="input-qtd form-control text-center border-0">

                        <div role="button" class="qtd-rem"><i style="pointer-events: none;"
                                class="px-2 fa-solid fa-minus"></i></div>
                    </div>

                    <button class="del-item btn p-1"><img height="20px" width="20px" src="/assets/imgs/components/cart/bin.png"
                            alt="botao-lixeira"></button>
                </div>
            </div>
        `;
    }

    // Insere os itens renderizados no carrinho
    box_items.innerHTML = data;

    // Atualiza subtotal
    changeSubTotalCart();
});

/* ================================
   OUTROS EVENTOS DO CARRINHO DE COMPRAS
   ================================ */

// Clique nos botões + e -
$(document).on("click", ".qtd-add, .qtd-rem", (productClicked) => {
    changePriceEnd(productClicked);
    changeSubTotalCart();
});

// Alteração manual no input de quantidade
$(document).on("change", ".input-qtd", (productClicked) => {
    if (isNaN(productClicked.target.value) || parseInt(productClicked.target.value) < 1 || parseInt(productClicked.target.value) > 1001)
        productClicked.target.value = 1;

    changePriceEnd(productClicked);
    changeSubTotalCart();
});

// Clique no botão de remover item
$(document).on("click", ".del-item", (productClicked) => {
    const item = productClicked.target.closest(".item");
    item.remove();

    localStorage.removeItem(item.id);
    changeQtdCart();
    changeSubTotalCart();
});

// Clique no botão de comprar (adiciona ao carrinho)
$(document).on("click", ".btn-buy", (btnClicked) => {
    const item = btnClicked.target.closest(".item");
    const inputQtd = item.querySelector(".input-qtd");

    const id = item.id;

    if (localStorage.getItem(id)) {
        const currentQtd = parseInt(localStorage.getItem(id));
        localStorage.setItem(id, currentQtd + parseInt(inputQtd.value));
        showToast();
        
        return;
    }

    localStorage.setItem(id, inputQtd.value);
    changeQtdCart();
    showToast();
});