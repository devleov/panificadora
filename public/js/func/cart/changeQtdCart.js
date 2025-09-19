/* ================================
   ATUALIZA A QUANTIDADE DE ITENS NO CARRINHO
   ================================ */
export default function changeQtdCart() {
    $(".qtd-cart").text(`(${localStorage.length})`);
}