const ytdl = require('ytdl-core');
const fs = require('fs');
const readline = require('readline');
const sanitize = require('sanitize-filename'); // sanitize faz com que os caracteres do 'titutloAarquivo' sejam todos válidos

// Cria uma interface de leitura de linha para interagir com o usuário no console
const leitor = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Pergunta ao usuário o link do vídeo
leitor.question("link do vídeo: ", function (res) {
    // Obtém informações básicas sobre o vídeo usando o módulo ytdl-core
    ytdl.getBasicInfo(res).then((resInfo) => {

        // Sanitiza o título do vídeo removendo caracteres inválidos para nomes de arquivo
        const tituloArquivo = sanitize(resInfo.videoDetails.title);

        // URL do vídeo
        const videoURL = res;

        // Diretório de saída para salvar o arquivo
        const outputDirectory = 'downloads';

        // Caminho completo do arquivo de saída
        const outputFilePath = `${outputDirectory}/${tituloArquivo}.mp4`;

        // Verifica se o diretório de saída existe e o cria se não existir
        if (!fs.existsSync(outputDirectory)) {
            fs.mkdirSync(outputDirectory);
        }

        // Opções para a qualidade do vídeo a ser baixado
        const options = {
            quality: 'highestvideo',
            filter: 'videoandaudio'
        };

        // Cria um stream de download usando ytdl-core
        const stream = ytdl(videoURL, options);

        // Evento de progresso, exibindo a porcentagem de conclusão do download
        stream.on('progress', (downloaded, total) => {
            const percent = (downloaded / total) * 100;
            console.log(`Baixando: ${percent.toFixed(2)}%`);
        });

        // Evento de conclusão do download
        stream.on('end', () => {
            console.log('Download concluído!');
            // Fecha a interface de leitura de linha após o download ser concluído
            leitor.close();
        });

        // Evento de erro durante o download
        stream.on('error', (error) => {
            console.error('Ocorreu um erro:', error);
            // Fecha a interface de leitura de linha em caso de erro
            leitor.close();
        });

        // Pipe (encaminha) o stream de download para um arquivo no sistema de arquivos
        stream.pipe(fs.createWriteStream(outputFilePath));
    });
});




