import contCart from "../../cart/contCart.js"

fetch("/contCart", {
    method: "POST",
    headers: { "Content-type": "application/json" }
}).then((resp) => resp.json()).then((data) => {
    contCart(data.tamanhoCarrinho);
})