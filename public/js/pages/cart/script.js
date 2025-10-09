import changeSubTotalCart from "../../func/cart/changeSubTotalCart.js";

let qtdSubTotal = 0;

async function validateCart() {
    /* Percorre o localStorage e obtém o objeto presente no localStorage */
    const value = eachStorage();

    if (!value.arrayStorage) return;

    const arrayStorage = value.arrayStorage;

    /* Requisição para verificação de ID existente no banco de dados */
    const resp = await fetch("/idValidation", {
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

    changeSubTotalCart();
}

const data = await validateCart(); // Aqui ele valida os IDS e os valores
fillCartItems(data); // Aqui ele preenche já com os valores validados

/* Quando o cliente clica para "ativar" o desconto */
$(".btn-coupon-discount").on("click", async () => {
    const elemValueDiscount = $(".discount-cart-shopping");
    const inputCoupon = $(".input-coupon-discont");
    const warnCoupon = $(".warn-coupon-discount");

    /* Sempre inicia o valor como zero */
    elemValueDiscount.text(0.00.toLocaleString("pt-br", {
        currency: "BRL",
        style: "currency",
    }));

    /* Atualiza o valor do sub-total */
    changeSubTotalCart();

    if (!inputCoupon.val()) {
        warnCoupon.text("");

        return inputCoupon.addClass("is-invalid");
    }

    inputCoupon.removeClass("is-invalid");

    $(".btn-coupon-discount").prop("disabled", true);

    /* Requisição para validação do cupom de desconto */
    const resp = await fetch("/activeCoupon", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ coupon: inputCoupon.val() })
    });

    const data = await resp.json();

    $(".btn-coupon-discount").prop("disabled", false);

    /* Quando o cupom de desconto está ativo e funcionando */
    if (data.status == 200) {
        inputCoupon.addClass("is-valid")
        warnCoupon.css("color", "green");

        elemValueDiscount.text(data.value_coupon.toLocaleString("pt-br", {
            currency: "BRL",
            style: "currency",
        }));

        changeSubTotalCart();
    }

    /* Quando o cupom de desconto está vencido ou inválido, ou erro de servidor */
    if (data.status == 400 || data.status == 500) {
        inputCoupon.addClass("is-invalid")
        warnCoupon.css("color", "red");
    }

    if (data.message) {
        if (interval) clearInterval(interval);

        warnCoupon.text(data.message);

        interval = setTimeout(() => {
            warnCoupon.text("");
        }, 5000);
    };
});

/* Quando o cliente clica para "consultar" o CEP */
$(".btn-consult-cep").on("click", async () => {
    const elemValueCep = $(".freight-cart-shopping");
    const inputCep = $(".input-consult-cep");
    const warnCep = $(".warn-consult-cep");

    const inputValCep = inputCep.val().replace(/\D/g, "");

    /* Sempre inicia o valor como zero */
    elemValueCep.text(0.00.toLocaleString("pt-br", {
        currency: "BRL",
        style: "currency",
    }));

    /* Atualiza o valor do sub-total */
    changeSubTotalCart();

    if (!inputValCep || inputValCep.length < 8) {
        warnCep.text("");

        return inputCep.addClass("is-invalid");
    }

    inputCep.removeClass("is-invalid");

    $(".btn-consult-cep").prop("disabled", true);

    /* Requisição para validação do cupom de desconto */
    const resp = await fetch("/consultCep", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ cep: inputValCep })
    });

    const data = await resp.json();

    $(".btn-consult-cep").prop("disabled", false);

    /* Quando o cupom de desconto está ativo e funcionando */
    if (data.status == 200) {
        inputCep.addClass("is-valid")
        warnCep.css("color", "green");

        elemValueCep.text(data.delivery_price.toLocaleString("pt-br", {
            currency: "BRL",
            style: "currency",
        }));

        changeSubTotalCart();
    }

    /* Quando o cupom de desconto está vencido ou inválido, ou erro de servidor */
    if (data.status == 400 || data.status == 500) {
        inputCep.addClass("is-invalid")
        warnCep.css("color", "red");
    }

    if (data.message) {
        warnCep.text(data.message);
    };
})

/* Quando o cliente clica para fazer o pedido */
$(".btn-place-order").on("click", async (e) => {
    const warnOrder = $(".warn-place-order");
    e.preventDefault();

    warnOrder.text("");
    warnOrder.css("color", "black");

    $(".btn-place-order").prop("disabled", true);

    /* Percorre os produtos selecionados para compra (já validados) */
    const productsSelected = await validateCart();

    /* Valida o cupom de desconto e o frete */
    const resp = await fetch("/orderValidation", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ cartItems: productsSelected })
    });

    const data = await resp.json();

    $(".btn-place-order").prop("disabled", false);

    if (data.status == 200) {
        warnOrder.text(data.message);
        warnOrder.css("color", "green");
    }

    if (data.status == 400) {
        warnOrder.text(data.message);
        warnOrder.css("color", "red");
    }
});