import addCart from "../../cart/addCart.js";
import contCart from "../../cart/contCart.js";
import openCart from "../../cart/openCart.js";

// Botão de adicionar o item no carrinho
const btnAddToCart = document.getElementById("add-to-cart");

// Mensagem de aviso do carrinho
const messageWarnCart = document.getElementById("cart-warn");

// Intervalo de aviso de mensagem do carrinho
let intervaloAviso = false;
// False - não há intervalo rodando
// True - há intervalo rodando

/* Importação da caixa da imagem do produto e a tag da imagem */
const box = document.getElementById("box-img-product");
const img = document.getElementById("img-product")

box.addEventListener("mousemove", (e) => {
    const rect = box.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    img.style.transformOrigin = `${x}px ${y}px`;
    img.style.transform = 'scale(2)';
})

box.addEventListener("mouseleave", () => {
    img.style.transformOrigin = "center center";
    img.style.transform = "scale(1)";
})


/* Detalhes do produto que o usuário está acessando */
const nameProduct = document.getElementById("nameProduct");
const priceProduct = document.getElementById("priceProduct").textContent.slice(3).replace(",", ".");
const inputQuanty = document.getElementById("quanty");

inputQuanty.addEventListener("change", () => {
    verificaQuantyInvalida();

    if (inputQuanty.value !== 0 && inputQuanty.value > 0 && inputQuanty.value !== 1) {
        let valorFinal = (parseFloat(inputQuanty.value) * parseFloat(priceProduct))

        messageWarnCart.innerHTML = `O valor final será de R$ ${valorFinal.toFixed(2).replace(".", ",")}`;
        messageWarnCart.style.visibility = "visible";
        messageWarnCart.style.color = "gray";

        const valorAntigo = inputQuanty.value;

        let intervaloValor = setTimeout(() => {
            const valorAtual = inputQuanty.value;

            // Se o valor do input mudar no intervalo de 5 segundos então vai cancelar o intervalo.
            if (valorAntigo !== valorAtual) {
                clearTimeout(intervaloValor);
            } else {
                messageWarnCart.innerHTML = "";
                messageWarnCart.style.visibility = "hidden";
                messageWarnCart.style.color = "red";
            }
        }, 5000)
    }
})

btnAddToCart.addEventListener("click", (event) => {
    event.preventDefault();

    verificaQuantyInvalida();
})

function verificaQuantyInvalida() {
    if (inputQuanty.value >= 1000) {
        inputQuanty.value = 10;
    }

    if (inputQuanty.value <= 0) {
        // Se o intervalo do aviso estiver rodando não execute.
        if (intervaloAviso) return;

        intervaloAviso = true;

        messageWarnCart.innerHTML = "O valor deve ser maior do que 0!";
        messageWarnCart.style.visibility = "visible";
        inputQuanty.style.border = "1px solid red"

        setTimeout(() => {
            intervaloAviso = false;

            messageWarnCart.innerHTML = "";
            messageWarnCart.style.visibility = "hidden";
            inputQuanty.style.border = ""
        }, 4000)
    }
}



/* Função de adicionar o item no carrinho */

const btnAddItemToCart = document.querySelectorAll(".add-to-cart-btn");

// Configurações do Toastr
toastr.options = {
    "closeButton": true,                  // Adiciona um botão de fechar
    "progressBar": true,                  // Exibe a barra de progresso
    "positionClass": "toast-top-right",   // Define a posição no canto superior direito
    "timeOut": "5000",                    // Duração do aviso (3 segundos)
    "extendedTimeOut": "6000",            // Tempo extra ao passar o mouse
    "showMethod": "fadeIn",               // Método de exibição
    "hideMethod": "fadeOut"               // Método ao fechar
};

btnAddItemToCart.forEach((element) => {
    element.addEventListener("click", async () => { 
        const data = await addCart(nameProduct, inputQuanty);

        if (data.status == 100) {
            toastr.warning(data.message, "Aviso");

            return;
        };

        if (data.status == 200) {
            toastr.success("Item adicionado com sucesso no carrinho de compras!", "Sucesso")
        };

    })
})

fetch("/contCart", {
    method: "POST",
    headers: { "Content-type": "application/json" }
}).then((resp) => resp.json()).then((data) => {
    contCart(data.tamanhoCarrinho);
})
