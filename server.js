const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/publish', (req, res) => {
    const { title, date, content, image } = req.body;

    // Implemente o código para gerar uma nova página HTML com base no modelo fornecido.
    const htmlContent = `<!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <!-- Adicione os estilos e scripts necessários aqui -->
    </head>
    <body>

        <header>
            <h1>${title}</h1>
        </header>

        <main>
            <article>
                <p>Publicado em ${date}</p>
                <h1>${title}</h1>
                <p>${content}</p>
            </article>
        </main>

        <footer>
            &copy; ${new Date().getFullYear()} Meu Blog
        </footer>

        <a href="https://thiagopx1.github.io/blog/blog.html" class="home-button">Home</a>

    </body>
    </html>`;

    // Salvar o conteúdo HTML em um arquivo
    const fileName = `post_${new Date().getTime()}.html`;
    const filePath = path.join(__dirname, 'public', fileName);

    fs.writeFile(filePath, htmlContent, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erro ao salvar o arquivo HTML.');
        } else {
            // Executar o comando de deploy no GitHub Pages
            exec('git add . && git commit -m "Adicionando novo post" && git push origin main', (error, stdout, stderr) => {
                if (error) {
                    console.error(error);
                    res.status(500).send('Erro ao realizar o deploy no GitHub Pages.');
                } else {
                    res.status(200).send('Post publicado com sucesso!');
                }
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor está executando em http://localhost:${PORT}`);
});
