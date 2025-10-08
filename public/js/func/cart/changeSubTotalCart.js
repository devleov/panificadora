import Database from "../../db/Database.js";

/* ================================
   FUNCIONAMENTO DO SUB-TOTAL DO CARRINHO
   ================================ */
export default function changeSubTotalCart() {
    let subTotal = 0;

    if (!eachStorage().arrayStorage) return;

    const value = eachStorage().arrayStorage;

    for (let i = 0; i < value.length; i++) {
        const id = value[i].id;
        const qtd = value[i].qtd;

        const item = Database.find((el) => el.id == id);
        
        /* Se não existe o ID no banco apaga ele do localStorage */
        if (!item) {
            localStorage.removeItem(id);
        } else {
            subTotal += (item.precoUnitario * qtd);
        }
    }

    /* Se o usuário estiver no carrinho de compras página é para calcular o sub-total sob descontos e fretes. */
    if ($(".order-summary").length === 1) {
        const freight = removeCurrency($(".freight-cart-shopping").text());
        const discount = removeCurrency($(".discount-cart-shopping").text());
        
        subTotal = ((subTotal - discount) + freight);
    }

    $(".sub-total-cart-shopping").text(subTotal.toLocaleString("pt-br", {
        currency: "BRL", 
        style: "currency",
    }));

    return subTotal;
}

function removeCurrency(string) {
    string = string.replace("R$", "");
    string = string.replace(",", ".");
    let number = parseFloat(string);

    return number;
}