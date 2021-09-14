const express = require("express");
const res = require("express/lib/response");
const app = express();
const PORT = 3333;
const livraria = []

app.use(express.json());

// Middleware
function verificarPrateleira(request, response, next) {
    const { id } = request.body;

    const livro = livraria.find((livro) => livro.id === id)

    if (!livro) {
        return response.status(400).json({ error: "Livro não encontrado" });
    }

    request.livro = livro;

    return next();
}

app.post("/prateleira", (request, response) => {
    const { id } = request.body; // desestruturação
    const { titulo, descricao, edicao, autor } = request.body;
    const livroExiste = livraria.some(
        (livraria) => livraria.id === id
    );

    if (livroExiste) {
        return response.status(400).json({ error: "Livro existente!" });
    }

    livraria.push({ id, titulo, descricao, edicao, autor })
    return response.status(201).send();
})

app.get("/armario", verificarPrateleira, (request, response) => {
    const { livro } = request;

    return response.json(livro);
})

app.put("/prateleira", verificarPrateleira, (request, response) => {
    const { livro } = request;
    const { titulo } = request.body;

    livro.titulo = titulo;

    return response.status(201).send();
})


app.delete("/prateleira", verificarPrateleira, (request, response) => {
    const { livro } = request;

    livraria.splice(livraria.indexOf(livro), 1);

    return response.status(200).json(livraria);
})

app.get("/entrarLivraria", (request, response) => {
    return response.status(201).json(livraria)
})

app.listen(PORT);