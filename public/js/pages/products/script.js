import addCart from '../../cart/addCart.js';

const addItemToCart = document.querySelectorAll(".add-to-cart-btn");

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

addItemToCart.forEach((element) => {
    element.addEventListener("click", (event) => {
        toastr.success(
            'Item adicionado ao carrinho com sucesso!',
            'Sucesso'
        );

        const cardItem = event.target.closest(".card-item");
        const cardBody = cardItem.querySelector(".card-body");

        const itemName = cardBody.querySelector(".card-item-name").textContent;

        addCart(itemName, 1);
    })
})


/* Configuração do sistema de ponto de pesquisa de categoria */

const categorySelect = document.getElementById("filterSearch");
const box_cards = document.getElementById("box-cards");
import arrayProducts from "../../db/array.js";

categorySelect.addEventListener("change", async () => {
    /* Limpando o conteúdo para colocar os elementos especificados */
    box_cards.querySelectorAll(".card-item").forEach((element) => {
        element.remove();
    })

    if (categorySelect.value == "todos") {
        arrayProducts.forEach(element => {
            
            const cardItem = document.createElement("div");
            cardItem.classList.add("card-item");

            cardItem.innerHTML = `
                <div class="card-img-item">
                    <img src="/assets/imgs/pages/products/items/${element.imagem}">
                </div>

                <div class="card-body">
                    <p class="card-item-name">${element.produto}</p>
                    <p class="card-item-price">${element.precoUnitario.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            })}</p>
                </div>

                <button class="add-to-cart-btn">
                    <img src="/assets/imgs/components/cart/cart-shopping.svg" alt="icone-de-carrinho">Adicionar no
                    carrinho
                </button>
            `;

            box_cards.appendChild(cardItem);
        })
    }

    const produtosFiltrados = arrayProducts.filter(element => element.especificidade == categorySelect.value)

    produtosFiltrados.forEach(element => {
        const cardItem = document.createElement("div");
        cardItem.classList.add("card-item");

        cardItem.innerHTML = `
                <div class="card-img-item">
                    <img src="/assets/imgs/pages/products/items/${element.imagem}">
                </div>

                <div class="card-body">
                    <p class="card-item-name">${element.produto}</p>
                    <p class="card-item-price">${element.precoUnitario.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })}</p>
                </div>

                <button class="add-to-cart-btn">
                    <img src="/assets/imgs/components/cart/cart-shopping.svg" alt="icone-de-carrinho">Adicionar no
                    carrinho
                </button>
            `;

        box_cards.appendChild(cardItem);
    })

    // 1. Encontrar onde o conteúdo dos cards estão sendo carregados
    // 2. Conseguir o array e filtrar de acordo com a especificidade do produto
    // 3. Obter o valor do filtro e recarregar o conteúdo com os produtos correspondentes
})
