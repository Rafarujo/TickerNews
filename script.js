// Função para carregar o feed RSS e atualizar a barra de notícias
async function loadRSSFeed(rssUrl, numNews) {
    try {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`);
        const data = await response.json();
        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, 'text/xml');
        const items = xml.querySelectorAll('item');
        
        // Obter o contêiner de notícias
        const newsContainer = document.getElementById('newsContainer');
        newsContainer.innerHTML = ''; // Limpar contêiner
        
        // Adicionar notícias ao contêiner
        for (let i = 0; i < Math.min(items.length, numNews); i++) {
            const item = items[i];
            const title = item.querySelector('title').textContent;
            const link = item.querySelector('link').textContent;
            
            // Criar elemento de notícia
            const newsItem = document.createElement('a');
            newsItem.classList.add('news-item');
            newsItem.href = link;
            newsItem.textContent = title;
            newsContainer.appendChild(newsItem);
        }
        
        // Iniciar a animação de rolagem
        startScrollingAnimation(newsContainer);
        
    } catch (error) {
        console.error('Erro ao carregar o feed RSS:', error);
    }
}

// Função para iniciar a animação de rolagem
function startScrollingAnimation(newsContainer) {
    // Adicionar a animação de rolagem ao contêiner de notícias
    newsContainer.style.animationName = 'scroll';
    newsContainer.style.animationDuration = document.getElementById('speed').value + 's';
    newsContainer.style.animationTimingFunction = 'linear';
    newsContainer.style.animationIterationCount = 'infinite';
    newsContainer.style.animationDirection = document.getElementById('direction').value === 'right' ? 'reverse' : 'normal';
}

// Função para atualizar a barra de notícias com as configurações escolhidas pelo usuário
async function updateNewsTicker() {
    const form = document.getElementById('editorForm');
    const rssUrl = form.rssUrl.value;
    const numNews = parseInt(form.numNews.value);
    const fontColor = form.fontColor.value;
    const backgroundColor = form.backgroundColor.value;
    const direction = form.direction.value;
    const speed = parseInt(form.speed.value);
    const fontSize = parseInt(form.fontSize.value); // Obtenha o valor de fontSize

    // Atualize o tamanho da fonte na pré-visualização
    const newsTicker = document.getElementById('newsContainer');
    newsTicker.style.fontSize = `${fontSize}px`; // Aplique o tamanho da fonte

    // Atualizar estilos do documento com base nas configurações do usuário
    document.documentElement.style.setProperty('--font-color', fontColor);
    document.documentElement.style.setProperty('--background-color', backgroundColor);
    document.documentElement.style.setProperty('--font-size', fontSize + 'px'); // Novo: Atualizar o tamanho da fonte

    // Atualizar a direção da animação
    const newsContainer = document.getElementById('newsContainer');
    if (direction === 'right') {
        newsContainer.style.animationDirection = 'reverse';
    } else {
        newsContainer.style.animationDirection = 'normal';
    }

    // Atualizar a velocidade da animação
    newsContainer.style.animationDuration = `${speed}s`;

    // Carregar o feed RSS e atualizar a barra de notícias
    await loadRSSFeed(rssUrl, numNews);

    // Atualizar a área de texto com o código HTML gerado
    updateHtmlCode(rssUrl, numNews, fontColor, backgroundColor, direction, speed, fontSize); // Atualize a função para incluir o tamanho da fonte
}

// Função para gerar e atualizar o código HTML exibido ao usuário
function updateHtmlCode(rssUrl, numNews, fontColor, backgroundColor, direction, speed, fontSize) {
    // Criação do código HTML com base nas configurações do usuário
    const htmlCode = `
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Barra de Notícias RSS</title>
    <style>
        /* Estilos para a barra de notícias RSS */
        .news-ticker {
            padding-top: 20px;
            padding-bottom: 20px;
            width: 100%;
            font-size: ${fontSize}px; // Novo: Use o tamanho da fonte
            overflow: hidden;
            white-space: nowrap;
            overflow-x: hidden;
            position: relative;
            font-family: Arial, sans-serif;
            color: ${fontColor};
            background-color: ${backgroundColor};
            display: inline-block; // Adiciona flexbox ao contêiner para alinhar ao centro
            align-items: center; // Alinha ao centro verticalmente
        }

        /* Estilos para o contêiner da barra de notícias */
        .news-ticker-container {
            display: inline-block;
            overflow-x: hidden;
            white-space: nowrap;
            animation: scroll ${speed}s linear infinite;
            overflow: hidden;
            animation-direction: ${direction};
        }

        /* Estilos para os itens de notícia */
        .news-item {
            display: inline-block;
            margin-right: 20px;
            white-space: nowrap;
            color: ${fontColor};
            text-decoration: none;
            text-transform: uppercase;
        }

        /* Animação para rolar o ticker de notícias */
        @keyframes scroll {
            from {
                transform: translateX(0%);
            }
            to {
                transform: translateX(-100%);
            }
        }
    </style>
</head>
<body>
    <div class="news-ticker">
        <div class="news-ticker-container">
            <!-- Conteúdo das notícias será carregado dinamicamente -->
        </div>
    </div>

    <script>
        async function loadRSSFeed() {
            const response = await fetch(\`https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}\`);
            const data = await response.json();
            const parser = new DOMParser();
            const xml = parser.parseFromString(data.contents, 'text/xml');
            const items = xml.querySelectorAll('item');
            
            const newsContainer = document.querySelector('.news-ticker-container');
            newsContainer.innerHTML = '';
            
            for (let i = 0; i < Math.min(items.length, ${numNews}); i++) {
                const item = items[i];
                const title = item.querySelector('title').textContent;
                const link = item.querySelector('link').textContent;
                
                const newsItem = document.createElement('a');
                newsItem.classList.add('news-item');
                newsItem.href = link;
                newsItem.textContent = title;
                newsContainer.appendChild(newsItem);
            }
            
            // Iniciar a animação de rolagem
            startScrollingAnimation(newsContainer);
        }
        
        document.addEventListener('DOMContentLoaded', loadRSSFeed);
    </script>
</body>
</html>
`;

    // Atualiza a caixa de texto com o código HTML gerado
    const htmlCodeArea = document.getElementById('htmlCode');
    htmlCodeArea.value = htmlCode;
}


// Função para copiar o código HTML exibido para a área de transferência
function copyHtmlCode() {
    const htmlCodeArea = document.getElementById('htmlCode');
    htmlCodeArea.select();
    document.execCommand('copy');
    alert('Código HTML copiado para a área de transferência!');
}
const translations = {
    pt: {
        title: "Editor de Barra de Notícias RSS",
        rssUrl: "Link do RSS:",
        numNews: "Quantidade de notícias:",
        fontColor: "Cor da fonte:",
        backgroundColor: "Cor do fundo:",
        direction: "Direção da animação:",
        speed: "Velocidade da animação:",
        updateButton: "Atualizar barra de notícias",
        copyButton: "Copiar código HTML",
        htmlCode: "v2:",
        signature: "Desenvolvido por [seu nome] no GitHub",
        fontSize: "Tamanho da fonte",
        h3: "Código HTML",
        // Adicione traduções para os outros elementos
    },
    en: {
        title: "RSS News Ticker Editor",
        rssUrl: "RSS Link:",
        numNews: "Number of news:",
        fontColor: "Font color:",
        backgroundColor: "Background color:",
        direction: "Animation direction:",
        speed: "Animation speed:",
        updateButton: "Update news ticker",
        copyButton: "Copy HTML code",
        htmlCode: "v2",
        signature: "Developed by [your name] on GitHub",
        fontSize: "Font size",
        h3: "HTML code",
        // Adicione traduções para os outros elementos
    }
};
function changeLanguage() {
    const language = document.getElementById("languageSelector").value;
    const translation = translations[language];
    
    // Atualize o conteúdo da interface com base no idioma selecionado
    document.querySelector("h1").textContent = translation.title;
    document.querySelector("label[for='rssUrl']").textContent = translation.rssUrl;
    document.querySelector("label[for='numNews']").textContent = translation.numNews;
    document.querySelector("label[for='fontColor']").textContent = translation.fontColor;
    document.querySelector("label[for='backgroundColor']").textContent = translation.backgroundColor;
    document.querySelector("label[for='direction']").textContent = translation.direction;
    document.querySelector("label[for='speed']").textContent = translation.speed;
    document.querySelector("label[for='fontSize']").textContent = translation.fontSize;
    
    // Atualize os botões
    document.querySelector("button[onclick='updateNewsTicker()']").textContent = translation.updateButton;
    document.querySelector("button[onclick='copyHtmlCode()']").textContent = translation.copyButton;
    
    // Atualize o código HTML
    document.querySelector("h3").textContent = translation.htmlCode;
    
    // Atualize a assinatura
    document.querySelector("#signature").textContent = translation.signature;
    
    // Outras atualizações de conteúdo, se necessário
}
// Define um idioma padrão ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("languageSelector").value = "en"; // Definir idioma padrão
    changeLanguage();
});