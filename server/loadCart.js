export default function handler(req, res) {
    if (!req.session.carrinho) {
        req.session.carrinho = [];
    }
    res.json({
        carrinho: req.session.carrinho,
        subTotal: req.session.carrinho.reduce((acumulador, valorAtual) => acumulador + valorAtual.quantidade * valorAtual.precoUnitario, 0)
    });
}