/* ================================
   FUNCIONAMENTO DO SUB-TOTAL DO CARRINHO
   ================================ */
export default function changeSubTotalCart() {
    let sub_total = 0;

    // Percorre todos os preços no carrinho e soma
    $(".offcanvas p.card-item-price").each((_, el) => {
        const item = el.closest(".item");

        const value = parseFloat(item.querySelector(".card-item-price").innerHTML.replace("R$&nbsp;", "").replace(",", "."));
        sub_total += value;
    });

    // Atualiza o sub-total no front-end
    $(".sub-total-offcanvas").text(`${sub_total.toLocaleString("pt-br", {
        currency: "BRL",
        style: "currency",
    })}`);
}