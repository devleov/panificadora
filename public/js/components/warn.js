export default function showToast() {
    const container = document.querySelector(".toast-container");

    const toast = document.createElement("div");

    toast.className = "toast align-items-center border-0 p-2";
    toast.role = "alert";
    toast.innerHTML = `
        <div class="d-flex text-white position-relative" style="font-family: Open Sans, sans-serif">
            <div class="toast-body fs-6"><img height="20px" width="20px" class="me-1" src="/assets/imgs/components/cart/cart-shopping.svg" alt="icone-do-carrinho-de-compras"> Item adicionado no carrinho!</div>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("hide");

        setTimeout(() => {
            $(toast).remove()
        }, 250)
    }, 2250)
    
};