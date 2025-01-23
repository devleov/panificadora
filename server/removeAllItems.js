export default function handler(req, res) {
    req.session.carrinho = [];
    res.json({ status: 200 });
}