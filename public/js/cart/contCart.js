const length_cart = document.querySelector(".length-cart");

export default function contCart(tamanhoCarrinho) {
    /* Parâmetro obtido a partir da função de adicionar o carrinho */
    /* Se for querer atualizar o contador adicione uma requisição para obter o carrinho */
    length_cart.textContent = `( ${tamanhoCarrinho} )`;
}