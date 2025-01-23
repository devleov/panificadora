import contCart from "../../cart/contCart.js"

fetch("/contCart", {
    method: "POST",
    headers: { "Content-type": "application/json" }
}).then((resp) => resp.json()).then((data) => {
    contCart(data.tamanhoCarrinho);
})

/* Funçãozinha para quando clicar no link da navbar ocorrer uma transição leve */
const box_links = document.querySelectorAll(".box-links ul li a");
const box_menu_links = document.querySelectorAll(".box-menu-links ul li a");

function transitionNavbar(href) {
    const elementHref = href.replace("/", "").replace("#", "");
    const element = document.getElementById(elementHref);

    if (elementHref == "") {
        // Se o href retornado for vazio, então é por que é o link home que foi clicado e por isso não precisa de transição.

        return;
    }

    window.scrollTo({ 
        top: element.offsetTop + 30 || 0,
        behavior: "smooth" 
    });
};

/* Ativando a transição para o menu de telas maiores */
box_links.forEach((element) => {
    const href = element.getAttribute("href");

    element.addEventListener("click", (e) => {
        e.preventDefault();

        transitionNavbar(href)
    });
});

/* Ativando a transição para o menu de telas pequenas */
box_menu_links.forEach((element) => {
    const href = element.getAttribute("href");

    element.addEventListener("click", (e) => {
        e.preventDefault();

        transitionNavbar(href)
    });
});



/* Funcionalidade de acordo com o horário abrir e fechar a loja */
const hourOpenShop = document.querySelector(".hour-open-shop");

const data = new Date();
const hour = data.getHours();
const hourOpen = "Horário: 7:00 as 12:00"

if (hour >= 6 && hour <= 12) { 
    hourOpenShop.innerHTML = `Status: Aberto - ${hourOpen}` 
    hourOpenShop.style.backgroundColor = "#8b4513"
} else {
    hourOpenShop.innerHTML = `Status: Fechado - ${hourOpen}`
    hourOpenShop.style.backgroundColor = "#C19A6B"
}