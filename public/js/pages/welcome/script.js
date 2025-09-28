/* ================================
   IMPORTAÇÕES DO CARRINHO DE COMPRAS
   ================================ */
import changeQtdCart from "../../func/cart/changeQtdCart.js"
import changeSubTotalCart from "../../func/cart/changeSubTotalCart.js"

// Executa logo ao carregar a página (caso já tenha itens)
changeQtdCart();
changeSubTotalCart(".sub-total-offcanvas");