export default function loadCart() {
    fetch("/loadCart", {
        method: "POST",
        headers: { "Content-type": "application/json" },
    }).then((resp) => resp.json()).then((data) => {
        const { carrinho, subTotal } = data;

        const modalCartItems = document.querySelector('.modal-cart-items');
        const subTotalElement = document.querySelector('#sub-total');

        modalCartItems.innerHTML = "";

        carrinho.forEach((element) => {
            const div = document.createElement('div');
            div.classList.add('cart-item');

            div.innerHTML = `
        <div class="box-content-item">
                <div>
                    <p id="product-name">${element.produto}</p>
                    <small>R$${(element.precoUnitario * element.quantidade).toFixed(2)}</small>
                    <p style="font-weight: bold;">Qt: <span>${element.quantidade}</span></p>
                </div>
                
                <button class="remove-btn-item">Remover</button>
            </div>
    `;

            modalCartItems.appendChild(div);
        });

        subTotalElement.textContent = `Sub-total: ${subTotal.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })}`;
    })

        .catch(error => console.error("Erro em carregar o carrinho:", error));
}