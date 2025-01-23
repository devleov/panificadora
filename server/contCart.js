export default function handler(req, res) {
    if (!req.session.carrinho) {
        req.session.carrinho = [];
    }
    res.json({ tamanhoCarrinho: req.session.carrinho.length });
}