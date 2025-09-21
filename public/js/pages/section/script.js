/* ================================
   IMPORTAÇÕES DE DEPENDÊNCIAS
   ================================ */
import Database from "../../db/Database.js";
import filterBySpecificity from "../../func/filterSpecificity.js";
import filterByFeature from "../../func/filterFeature.js";

/* ================================
   IMPORTAÇÕES DO CARRINHO DE COMPRAS
   ================================ */
import changePriceEnd from "../../func/cart/changePriceEnd.js"
import changeQtdCart from "../../func/cart/changeQtdCart.js"
import changeSubTotalCart from "../../func/cart/changeSubTotalCart.js"

// Executa logo ao carregar a página (caso já tenha itens)
changeQtdCart();
changeSubTotalCart();

/* ================================
   CAPTURA DE ELEMENTOS DO DOM
   ================================ */
const boxSearchProducts = document.getElementById("boxSearchProducts");
const category = boxSearchProducts.getAttribute("data-category"); // Categoria vinda do HTML (ex: pães, bolos, etc.)

const filterSelect = document.getElementById("filter"); // Select para filtrar os produtos
const spanQuantyItem = document.getElementById("productLength"); // Quantidade de itens encontrados
const boxProducts = document.getElementById("box-products"); // Container onde os produtos serão renderizados

const btnInputSearch = document.getElementById("btnInputSearch"); // Botão de pesquisar
const inputSearch = document.getElementById("inputSearch"); // Campo de texto de pesquisa


/* ================================
   FUNÇÃO: RENDERIZAÇÃO DOS PRODUTOS
   ================================ */
function fillProductBox(dataProducts, boxProducts) {
    // Verifica se os dados são válidos
    if (!dataProducts || !Array.isArray(dataProducts)) return;

    // Atualiza a quantidade de produtos encontrados
    spanQuantyItem.innerText = dataProducts.length;

    // Limpa o container antes de renderizar os produtos
    boxProducts.innerHTML = "";

    // Para cada produto, cria um card e insere no container
    dataProducts.forEach((el) => {
        const container = document.createElement("div");

        const card = `
            <div class="item" id="${el.id}">
                <a style="text-decoration: none;" href="${category}/${el.url_produto}">
                    <div class="card-item d-flex flex-column p-2 gap-2">
                        <div class="card-img-item rounded">
                            <img class="rounded" src="/assets/imgs/pages/section/${el.imagem}">
                        </div>

                        <div class="card-body">
                            <p class="card-item-name fs-5 mb-0">${el.produto}</p>
                            <p class="card-item-price fs-6 mb-0">${el.precoUnitario.toLocaleString("pt-br", {
                                style: "currency",
                                currency: "BRL",
                            })}</p>
                        </div>
                </a>

                <div class="card-footer d-flex">
                    <div class="d-flex justify-content-between align-items-center me-2 border rounded">
                        <div role="button" class="qtd-add px-2 py-1"><i style="pointer-events: none;"
                                class="fa-solid fa-plus"></i></div>

                        <input min="1" type="text" value="1"
                            class="input-qtd form-control mx-auto text-center border-0 w-75">

                        <div role="button" class="qtd-rem px-2 py-1"><i style="pointer-events: none;"
                                class="fa-solid fa-minus"></i></div>
                    </div>
                    <button class="btn-buy btn text-white"
                        style="background-color: #c5a073; letter-spacing: .5px; font-family: 'Merriweather', sans-serif;">COMPRAR</button>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = card;
        boxProducts.appendChild(container);
    });
};


/* ================================
   FILTRAGEM DE PRODUTOS
   ================================ */
let dataFiltred = "";

// Evento disparado quando o usuário muda a opção no <select>
filterSelect.addEventListener("change", () => {
    const valueOption = filterSelect.value;

    // Caso selecione "todos", mostra todos os produtos da categoria
    if (valueOption == "todos") {
        dataFiltred = Database.filter((el) => el.categoria == category);
        return fillProductBox(dataFiltred, boxProducts);
    };

    // Se for categorias específicas, aplica o filtro correspondente
    if (category == "pães" || category == "bolos" || category == "varejo" || category == "salgadinhos") {
        dataFiltred = filterBySpecificity(category, valueOption);
    } else {
        dataFiltred = filterByFeature(category, valueOption);
    }

    // Re-renderiza os produtos filtrados
    fillProductBox(dataFiltred, boxProducts);
});


/* ================================
   PESQUISA POR NOME
   ================================ */

// Normaliza as strings removendo acentos e colocando em minúsculas
function normalizeString(string) {
    return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Pesquisa os produtos de acordo com o texto digitado
function searchByName() {
    // Se o campo de pesquisa estiver vazio, mostra todos da categoria
    if (!inputSearch.value) {
        dataFiltred = Database.filter((el) => el.categoria == category);
        return fillProductBox(dataFiltred, boxProducts);
    }

    // Filtra apenas produtos que contenham o texto pesquisado
    dataFiltred = Database.filter((el) =>
        el.categoria == category &&
        normalizeString(el.produto).includes(normalizeString(inputSearch.value))
    );

    spanQuantyItem.innerText = dataFiltred.length;
    fillProductBox(dataFiltred, boxProducts);
};

// Atalho: tecla ENTER aciona a pesquisa
inputSearch.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
        searchByName();
    }
});

// Clique no botão aciona a pesquisa
btnInputSearch.addEventListener("click", () => {
    searchByName();
});