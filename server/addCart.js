import array from "../public/js/db/Database.js";

export default function handler(req, res) {
    if (!req.session.carrinho) {
        req.session.carrinho = [];
    }

    const { nomeProduto, quantProduto } = req.body;

    try {
        const produto = array.find(element => element.produto === nomeProduto);

        if (!produto) {
            return res.status(100).json({ status: 100, message: "Produto não encontrado no sistema!" });
        }

        const precoUnitario = produto.precoUnitario;
        const produtoExisteOuNao = req.session.carrinho.find(element => element.produto === nomeProduto);

        if (produtoExisteOuNao) {
            produtoExisteOuNao.quantidade += quantProduto;
        } else {
            if (req.session.carrinho.length == 10) {
                return res.json({ message: "Tamanho do carrinho máximo atingido!", status: 100 });
            }
            req.session.carrinho.push({ produto: nomeProduto, precoUnitario, quantidade: quantProduto });
        }

        res.json({ tamanhoCarrinho: req.session.carrinho.length, status: 200 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro no servidor", status: 500 });
    }
}