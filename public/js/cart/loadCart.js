import cart from "../pages/home/script.js";

export default function carregarCarrinho() {
    const modal_cart_items = document.getElementById("modal-cart-items");

    modal_cart_items.innerHTML = "";

    cart.forEach((element) => {
        const div = document.createElement("div");
        div.classList.add("cart-item");

        div.innerHTML = (
            `
        <div>
            <p id="product-name">${element.produto}</p>
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

window.carregarCarrinho = carregarCarrinho;