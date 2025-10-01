const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'portfolio-data.json');

// Middleware para servir arquivos estáticos (como index.html)
app.use(express.static(path.join(__dirname)));
// Middleware para entender o corpo das requisições como JSON
app.use(express.json());

// Rota GET para buscar os dados
app.get('/api/data', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            // Se o arquivo não existir, criamos ele com um objeto vazio.
            if (err.code === 'ENOENT') {
                fs.writeFile(DATA_FILE, JSON.stringify({}, null, 2), (writeErr) => {
                    if (writeErr) {
                        console.error('Erro ao criar o arquivo de dados:', writeErr);
                        return res.status(500).json({ message: "Erro interno no servidor." });
                    }
                    return res.json({});
                });
            } else {
                console.error('Erro ao ler o arquivo de dados:', err);
                return res.status(500).json({ message: "Erro ao ler os dados." });
            }
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// Rota POST para salvar os dados
app.post('/api/data', (req, res) => {
    const newData = req.body;

    if (!newData) {
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

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log('Certifique-se de que o arquivo index.html está na mesma pasta.');
});
