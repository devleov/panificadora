import changeSubTotalCart from "../../func/cart/changeSubTotalCart.js";

let qtdSubTotal = 0;

async function validateCart() {
    /* Percorre o localStorage e obtém o objeto presente no localStorage */
    const value = eachStorage();

    if (!value.arrayStorage) return;

    const arrayStorage = value.arrayStorage;

    /* Requisição para verificação de ID existente no banco de dados */
    const resp = await fetch("/validationID", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ arrayStorage })
    });

    if (!resp.ok) return;

    const data = await resp.json();

    if (!Array.isArray(data)) return;

    /* Itera sobre o retorno do banco de dados e tira do localStorage os itens com IDS não existentes */
    data.forEach((el, index) => {
        if (el.blocked === true) {
            /* Remove o item do front-end */
            localStorage.removeItem(el.id);

            if (index !== -1) {
                data.splice(index, 1);
            }
        }
    });

    return data;
}

function fillCartItems(data) {
    if (!Array.isArray(data)) return;

    data.forEach((el) => {
        const item = document.createElement("div");
        item.id = el.id;
        item.className = "item d-flex justify-content-between gap-3 flex-wrap";

        const totalValueItem = el.precoUnitario * el.quantidade;

        const dataItem = `
             <div class="d-flex">
                 <img style="object-fit: cover;" class="rounded border me-2" height="50px" width="50px" src="/assets/imgs/pages/section/${el.imagem}" alt="">
                 <div
                 style="width: 100px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;">
                     <p class="fs-6">${el.produto}</p>
                 </div>
             </div>

             <div>
                 <p class="fs-6">Preço Unit:</p>
                 <p class="fs-6">${el.precoUnitario.toLocaleString("pt-br", {
            currency: "BRL",
            style: "currency",
        })}</p>
             </div>

             <div class="d-flex justify-content-between align-items-center me-2 border rounded">
                 <div role="button" class="qtd-add px-2 py-1"><i style="pointer-events: none;"
                 class="fa-solid fa-plus"></i></div>

                 <input min="1" type="text" value="${el.quantidade}"
                 class="input-qtd p-0 form-control mx-auto text-center border-0"
                 style="background-color: transparent; margin: 0 !important; width: 100px">

                 <div role="button" class="qtd-rem px-2 py-1"><i style="pointer-events: none;"
                     class="fa-solid fa-minus"></i></div>
                 </div>

                 <div style="min-width: 100px";>
                     <p class="fs-6"><b>Total</b></p>
                     <p class="fs-6 total-item-cart-shopping">${totalValueItem.toLocaleString("pt-br", {
            currency: "BRL",
            style: "currency",
        })}</p>
                 </div>

                 <button class="del-item btn p-1"><img height="20px" width="20px" src="/assets/imgs/components/cart/bin.png"
                             alt="botao-lixeira"></button>`;

        item.innerHTML = dataItem;
        $(".box-product-cart").append(item);
    });

    $(".sub-total-cart-shopping").text(qtdSubTotal.toLocaleString("pt-br", {
        currency: "BRL",
        style: "currency",
    }));
}

const data = await validateCart(); // Aqui ele valida os IDS e os valores
fillCartItems(data); // Aqui ele preenche já com os valores validados

/* Quando o cliente clica para fazer o pedido */
$(".place-order").on("click", (e) => {
    e.preventDefault();

    validateCart()
});