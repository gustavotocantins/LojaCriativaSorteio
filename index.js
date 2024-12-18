
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve arquivos estáticos na pasta public
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
