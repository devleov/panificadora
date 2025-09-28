import Database from "../../db/Database.js";
import changeSubTotalCart from "../../func/cart/changeSubTotalCart.js";

const freightValue = 9.70;
const possibleLocations = ["Riolândia"];
const discountCoupons = [
    {
        coupon: "BAKERY123",
        discount: 5.00,
    },
    {
        coupon: "CLIENTE10",
        discount: 7.00,
    }
]

let cartItems = [];
let qtdSubTotal = 0;

loadCart();
changeSubTotalCart();

function loadCart() {
    for (let i = 0; i < localStorage.length; i++) {

        const key = localStorage.key(i);

        const data = Database.find((el) => el.id == key);

        const id = data.id;
        const produto = data.produto;
        const precoUnitario = data.precoUnitario;
        const imagem = data.imagem;
        const quantidade = localStorage.getItem(key);

        qtdSubTotal += (precoUnitario * quantidade);

        cartItems.push({ id, produto, imagem, precoUnitario, quantidade })
    };

    cartItems.forEach((el) => {
        const item = document.createElement("div");
        item.id = el.id;
        item.className = "item d-flex justify-content-between gap-3 flex-wrap";

        const totalCartShopping = el.precoUnitario * el.quantidade;

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
                    <p class="fs-6 total-item-cart-shopping">${totalCartShopping.toLocaleString("pt-br", {
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

$(".btn-consult-cep").on("click", async () => {
    const inputConsult = $(".input-consult-cep");
    let cep = inputConsult.val();

    /* Mensagem de aviso inválido */
    const feedInvalid = $(".consult-cep .feedback-is-invalid p")
    feedInvalid.text("");

    /* Mensagem de aviso válido */
    const feedValid = $(".consult-cep .feedback-is-valid p")
    feedValid.text("");

    /* Elemento de valor referente ao frente */
    const freightElement = $(".freight-cart-shopping");

    /* Removendo traços, pontos e letras */
    cep = cep.replace(/[^0-9]/g, "");

    if (cep.length < 8) {
        inputConsult.addClass("is-invalid");
        feedInvalid.text("Deve ter pelo menos 8 digítos!");
        feedInvalid.css("color", "black");

        return;
    }

    feedInvalid.text("Buscando cep...");
    feedInvalid.css("color", "black");

    const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await resp.json();
    feedInvalid.text("");

    if (data.erro == "true") {
        inputConsult.addClass("is-invalid");
        inputConsult.removeClass("is-valid");

        feedInvalid.text("Não encontramos seu CEP..");
        feedInvalid.css("color", "red");

        freightElement.text(0.00.toLocaleString("pt-br", {
            currency: "BRL",
            style: "currency",
        }));

        changeSubTotalCart();

        return;
    }

    if (!data.localidade.includes(possibleLocations)) {
        inputConsult.addClass("is-invalid");
        inputConsult.removeClass("is-valid");

        feedInvalid.text("Infelimente não conseguimos entregar nesta localidade..");
        feedInvalid.css("color", "red");

        freightElement.text(0.00.toLocaleString("pt-br", {
            currency: "BRL",
            style: "currency",
        }));

        changeSubTotalCart();

        return;
    }

    if (data.localidade.includes(possibleLocations)) {
        inputConsult.removeClass("is-invalid");
        inputConsult.addClass("is-valid");

        feedValid.text("Ótima notícia! Entregamos no seu endereço! Já calculamos o frete.")
        feedValid.css("color", "green");

        freightElement.text(freightValue.toLocaleString("pt-br", {
            currency: "BRL",
            style: "currency",
        }));

        changeSubTotalCart();

        return;
    }
});

$(".btn-coupon-discount").on("click", () => {
    const inputCoupon = $(".input-coupon-discont");

    const feedValid = $(".coupon-discount .feedback-is-valid p");
    feedValid.text("");

    const feedInvalid = $(".coupon-discount .feedback-is-invalid p");
    feedInvalid.text("");

    if (!inputCoupon.val()) {
        inputCoupon.removeClass("is-valid");
        inputCoupon.addClass("is-invalid");

        feedInvalid.text("O campo está vazio..");

        return;
    }


    for (let i = 0; i < discountCoupons.length; i++) {
        if (inputCoupon.val().toLowerCase().includes(discountCoupons[i].coupon.toLowerCase())) {
            feedInvalid.text("");

            inputCoupon.addClass("is-valid");
            inputCoupon.removeClass("is-invalid");

            feedValid.text("Parabéns você ativou o cupom!");
            feedValid.css("color", "green");

            $(".discount-cart-shopping").text(discountCoupons[i].discount.toLocaleString("pt-br", {
                currency: "BRL",
                style: "currency",
            }));

            changeSubTotalCart();

            return;
        }
    }

    feedValid.text("");

    feedInvalid.text("Cupom inválido ou expirado..");
    feedInvalid.css("color", "red");

    inputCoupon.removeClass("is-valid");
    inputCoupon.addClass("is-invalid");

    changeSubTotalCart();
});