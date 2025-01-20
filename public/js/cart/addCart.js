import contCart from "./contCart.js";

export default async function addCart(nameProduct, inputQuanty) {
    /* Na função de adicionar o carrinho, adiciona o item no carrinho e o contador atualiza */

    const resp = await fetch("/addCart", {
        method: "POST",
        body: JSON.stringify({
            nomeProduto: nameProduct.innerHTML,
            quantProduto: parseFloat(inputQuanty.value),
        }),
        headers: { "Content-type": "application/json" },
    })

    const data = await resp.json();
    
    if (data.status == 100) {
        /* Se a requisição do back-end vir 100, então retorne para o front end o status 100 */
        return {
            message: data.message,
            status: 100,
        }
    } else {
        /* Passa o tamanho do carrinho atualizado para a função */
        contCart(data.tamanhoCarrinho);

        return {
            status: 200,
        }
    }
}