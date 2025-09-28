import Database from "../../db/Database.js";

/* ================================
   FUNCIONAMENTO DO SUB-TOTAL DO CARRINHO
   ================================ */
export default function changeSubTotalCart() {
    let subTotal = 0;

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);

        const precoUnitario = Database.find((el) => el.id == key).precoUnitario;

        subTotal += (precoUnitario * value);
    }

    /* Se o usuário estiver no carrinho de compras é para calcular o sub-total sob descontos e fretes. */
    if ($(".order-summary").length === 1) {
        const freight = removeCurrency($(".freight-cart-shopping").text());
        const discount = removeCurrency($(".discount-cart-shopping").text());
        
        subTotal = ((subTotal - discount) + freight);
    }

    $(".sub-total-cart-shopping").text(subTotal.toLocaleString("pt-br", {
        currency: "BRL", 
        style: "currency",
    }));
}

function removeCurrency(string) {
    string = string.replace("R$", "");
    string = string.replace(",", ".");
    let number = parseFloat(string);

    return number;
}