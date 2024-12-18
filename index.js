const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 80;

const cors = require('cors');
const mysql = require('mysql2/promise'); // Usando versão com promises para async/await

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do pool de conexões
const pool = mysql.createPool({
  host: 'myboxclub.com.br',
  user: 'u129712343_guga',
  password: 'GustavoTocantins360#',
  database: 'u129712343_Teste',
  waitForConnections: true,
  connectionLimit: 10,
});
// Serve arquivos estáticos na pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Serve o arquivo index.html na rota raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Rota para cadastro/atualização
app.post('/pessoas', async (req, res) => {
  const { numeroCompra, nome, cpf, telefone } = req.body;

  try {
    const connection = await pool.getConnection();

    // Verifica se o CPF já existe no banco
    const [rows] = await connection.query('SELECT * FROM pessoas WHERE cpf = ?', [cpf]);
    if (rows.length > 0) {
      // Atualiza os dados existentes
      await connection.query(
        'UPDATE pessoas SET nome = ?, telefone = ?, numeroCompra = CONCAT(numeroCompra, ?) WHERE cpf = ?',
        [nome, telefone, `,${numeroCompra}`, cpf]
      );
      res.json({ message: 'Cadastro atualizado com sucesso!' });
    } else {
      // Insere um novo registro
      await connection.query(
        'INSERT INTO pessoas (numeroCompra, nome, cpf, telefone) VALUES (?, ?, ?, ?)',
        [numeroCompra, nome, cpf, telefone]
      );
      res.json({ message: 'Cadastro realizado com sucesso!' });
    }
    connection.release();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao processar o cadastro.' });
  }
});

// Rota para consulta por CPF
app.get('/pessoas/:cpf', async (req, res) => {
  const { cpf } = req.params;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM pessoas WHERE cpf = ?', [cpf]);

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'CPF não encontrado.' });
    }
    connection.release();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao consultar o cadastro.' });
  }
});

// Rota para listar todas as pessoas
app.get('/pessoas', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM pessoas');

    res.json(rows);
    connection.release();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao listar pessoas.' });
  }
});
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
