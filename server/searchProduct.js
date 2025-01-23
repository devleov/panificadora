export default function handler(req, res) {
    if (!req.session.carrinho) {
        req.session.carrinho = [];
    }

    const { nameProduct } = req.body;
    const produto = req.session.carrinho.find(element => element.produto === nameProduct);
    const index = req.session.carrinho.findIndex(element => element.produto === nameProduct);

    if (!produto) return;

    if (produto.quantidade == 1) {
        req.session.carrinho.splice(index, 1);
        res.json({ param: "remover", tamanhoCarrinho: req.session.carrinho.length, status: 200 });
    } else {
        produto.quantidade--;
        req.session.save();
        res.json({ param: "decrementado", produto, status: 200 });
    }
}