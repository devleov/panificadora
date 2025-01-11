/* Caixa principal de pesquisa dos produtos */
const boxSearchProducts = document.getElementById("boxSearchProducts");

/* Select de filtragem de especificidade */
const filterSelect = document.getElementById("filter");

/* Função para pesquisa por nome do produto */
import searchName from "../../db/SearchName.js"

/* Função para filtragem */
import Filter from "../../db/Filter.js";

/* Categoria em relação ao produto */
const category = boxSearchProducts.getAttribute("data-category");

/* Quantidade de produtos retornado da filtragem */
const spanQuantyItem = document.getElementById("productLength")

/* Caixa dos cards */
const boxCards = document.getElementById("box-cards");

filterSelect.addEventListener("change", () => {
    /* Especificidade do produto que vai filtrar */
    const specificity = filterSelect.value;
    
    /* Executando a função de filtragem */
    const items = Filter(category, specificity);

    /* Se caso não der certo dê erro e mostre no console */
    if (items.status == 500) {
        return console.error(items);
    };
    
    /* Tamanho do array que veio da filtragem */
    const productLength = items.data.length;
    spanQuantyItem.innerText = productLength;

    /* Limpando os cards */
    boxCards.innerHTML = "";

    if (items.data.includes("Não há nenhum item")) {
        spanQuantyItem.innerText = 0;
        
        const p = document.createElement("p")
        p.innerHTML = items.data;
        p.style.fontWeight = "bold";
        p.style.color = "brown";
        p.style.fontSize = "21px";
        p.style.fontFamily = "sans-serif";

        boxCards.appendChild(p);

        return;
    }

    /* Fazer mudar o conteúdo dinamicamente pela caixa principal dos cards usando .forEach */
    items.data.forEach((element) => {
        /* Link que fica envolta do card */
        const link = document.createElement("a");
        link.href = `${element.categoria}/${element.url_produto}`;
        
        const cardItem = document.createElement("div");
        cardItem.classList.add("card-item");
        cardItem.id = element.id;

        cardItem.innerHTML = `
            <div class="card-item" id="${element.id}">
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
            </div>
        `;

        link.appendChild(cardItem);
        boxCards.appendChild(link);
    })
})



/* Funcionalidade de pesquisar o item por produto */

const btnInputSearch = document.getElementById("btnInputSearch");
const inputSearch = document.getElementById("inputSearch");

btnInputSearch.addEventListener("click", () => {
    let data;

    if (!inputSearch.value) {
        data = searchName(category)
    }

    data = searchName(category, inputSearch.value);

    /* Limpando antes de adicionar o elemento filtrado */
    boxCards.innerHTML = "";
    
    if (data.includes("Não há nenhum item")) {
        spanQuantyItem.innerText = 0;
        
        const p = document.createElement("p")
        p.innerHTML = data;
        p.style.fontWeight = "bold";
        p.style.color = "brown";
        p.style.fontSize = "21px";
        p.style.fontFamily = "sans-serif";

        boxCards.appendChild(p);

        return;
    }

    /* Tamanho do array que veio da filtragem */
    const productLength = data.length;
    spanQuantyItem.innerText = productLength;

    data.forEach((element) => {
        /* Link que fica envolta do card */
        const link = document.createElement("a");
        link.href = `${element.categoria}/${element.url_produto}`;
        
        const cardItem = document.createElement("div");
        cardItem.classList.add("card-item");
        cardItem.id = element.id;

        cardItem.innerHTML = `
            <div class="card-item" id="${element.id}">
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
            </div>
        `;

        link.appendChild(cardItem);
        boxCards.appendChild(link);
    });
});