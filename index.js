const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 80;

// Serve arquivos estáticos na pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Serve o arquivo index.html na rota raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
