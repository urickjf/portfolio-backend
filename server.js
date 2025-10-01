const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'portfolio-data.json');

// --- Configuração do CORS (Simplificada) ---
// Habilita o CORS para todas as requisições. 
// Esta é a forma mais comum e robusta de usar a biblioteca.
app.use(cors());

// Middleware para entender o corpo das requisições como JSON
app.use(express.json());

// Rota GET para buscar os dados
app.get('/api/data', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.log('Arquivo de dados não encontrado, retornando objeto padrão.');
                 // Se o arquivo não existe, cria um com dados padrão para evitar erros no frontend
                const defaultDataContent = {}; // Começa vazio
                fs.writeFile(DATA_FILE, JSON.stringify(defaultDataContent, null, 2), (writeErr) => {
                    if (writeErr) {
                         console.error('Erro ao criar o arquivo de dados:', writeErr);
                         return res.status(500).json({ message: "Erro interno no servidor." });
                    }
                    return res.json(defaultDataContent);
                });
            } else {
                console.error('Erro ao ler o arquivo de dados:', err);
                return res.status(500).json({ message: "Erro ao ler os dados." });
            }
        } else {
            try {
                // Se o arquivo estiver vazio, retorna um objeto vazio para não quebrar o frontend
                res.json(JSON.parse(data || '{}'));
            } catch (parseErr) {
                res.json({});
            }
        }
    });
});

// Rota POST para salvar os dados
app.post('/api/data', (req, res) => {
    const newData = req.body;

    if (!newData || Object.keys(newData).length === 0) {
        return res.status(400).json({ message: 'Nenhum dado recebido.' });
    }

    fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Erro ao salvar os dados:', err);
            return res.status(500).json({ message: "Erro ao salvar os dados no servidor." });
        }
        res.status(200).json({ message: 'Dados salvos com sucesso!' });
    });
});

// Rota raiz para verificar se o servidor está online
app.get('/', (req, res) => {
    res.send('Servidor do Portfólio está online e funcionando!');
});


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

