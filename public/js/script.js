const txt_dinamic = document.getElementById("txt-dinamic");
const txt_fixed = document.getElementById("txt-fixed");

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

    // txt_fixed.style.width = `${25 + array[index].length}ch`;

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

            // txt_fixed.style.width = `${25 + array[index].length}ch`;

            interval = false;

            intervalCaracter = setInterval(escrevaCaracter, 150);

        }, 2000)

        intervalEspera = clearTimeout(tempoDeEspera)
    }
}




/* Configuração do sistema do carrinho de compras */

const cart = [
    {
        produto: "Pão francês",
        precoUnitario: 1,
        quantidade: 5
    },
    {
        produto: "Pão doce",
        precoUnitario: 2.99,
        quantidade: 3
    },
    {
        produto: "Bolo de chocolate",
        precoUnitario: 19.99,
        quantidade: 2
    },
    {
        produto: "Refrigerante Coca Cola",
        precoUnitario: 3.99,
        quantidade: 1
    },
];

const modal_cart_items = document.getElementById("modal-cart-items"); // Caixa principal dos pedidos

function carregarCarrinho() {
    modal_cart_items.innerHTML = "";

    cart.forEach((element) => {
        div = document.createElement("div");
        div.classList.add("cart-item");

        div.innerHTML = (
            `
        <div>
            <p>${element.produto}</p>
            <small>R$${(element.precoUnitario * element.quantidade).toFixed(2)}</small>
            <p style="font-weight: bold;">Qt: <span>${element.quantidade}</span></p>
        </div>
    
        <button class="remove-btn-item">Remover</button>
        `
        );

        modal_cart_items.appendChild(div);
    });

    const sub_total = document.getElementById("sub-total");

    const value_sub_total = cart.reduce((acumulador, valorAtual) => {
        return acumulador + valorAtual.precoUnitario * valorAtual.quantidade;
    }, 0)

    sub_total.textContent = `Sub-total: ${value_sub_total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })}`;
}





const cart_shopping = document.getElementById("cart-shopping"); // Botão para abrir/fechar meu carrinho
const modal_cart_shopping = document.getElementById("modal-cart-shopping"); // Modal do carrinho de compras
const modal_btn_close = document.getElementById("modal-btn-close"); // Botão para fechar o carrinho de compras
const modal_btn_buy = document.getElementById("modal-btn-buy"); // Botão para fazer o pedido

modal_cart_shopping.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal-cart-shopping")) {
        fecharCarrinho();
    }

    if (event.target.classList.contains("modal-btn-close")) {
        fecharCarrinho();
    }

    if (event.target.classList.contains("remove-btn-item")) {
        /* Remover um item do carrinho ou remover */

        const cartItem = event.target.closest(".cart-item");

        const productRemove = cart.find((element) => {
            return element.produto == cartItem.getElementsByTagName("p")[0].innerHTML
        });

        if (productRemove.quantidade > 1) {
            productRemove.quantidade -= 1;
        } else {
            cartItem.remove()

            const index = cart.indexOf(productRemove);

            cart.splice(index, 1);
            atualizarContadorCarrinho()
        }

        carregarCarrinho();
    }
})

cart_shopping.addEventListener("click", () => {
    abrirCarrinho();
})

/* Funções para abrir ou fechar o carrinho */

function abrirCarrinho() {
    modal_cart_shopping.classList.add("open");
    carregarCarrinho();
}

function fecharCarrinho() {
    modal_cart_shopping.classList.remove("open");
}

/* Alterando a quantidade de items no carrinho no elemento `cart-shopping` */
function atualizarContadorCarrinho() {
    cart_shopping.getElementsByTagName("span")[0].textContent = "(" + cart.length + ")" ;
}

atualizarContadorCarrinho()





<<<<<<< HEAD
/* Configuração do botão de enviar o pedido */

const observer = new MutationObserver(() => {
    if (modal_cart_items.innerHTML == "") {
        modal_btn_buy.disabled = true;
        modal_cart_items.style.padding = "0px";
        modal_cart_items.style.margin = "0px";

        modal_btn_buy.classList.add("modal_btn_buy_disabled")

    } else {
        modal_btn_buy.disabled = false;
        modal_cart_items.style.padding = "20px";
        modal_cart_items.style.marginTop = "30px";
        modal_cart_items.style.marginBottom = "30px";
        
        modal_btn_buy.classList.remove("modal_btn_buy_disabled")
    }

});

observer.observe(modal_cart_items, { childList: true, subtree: true });
=======








/* Configuração do menu da nav-bar */

const box_menu_items = document.getElementsByClassName("box-menu-items")[0];

document.getElementById("menu").addEventListener("click", () => {
    console.log("cliquei no menu")

    if (!box_menu_items.classList.contains("show")) {
        box_menu_items.classList.add("show");
    } else {
        box_menu_items.classList.remove("show");
    }
})
>>>>>>> 7e7f8cc5b1aa13ac71e656cdc5eae7e23754ff50
