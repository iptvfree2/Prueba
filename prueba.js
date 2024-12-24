const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    const { link } = req.query;

    if (!link) {
        return res.status(400).json({ error: 'Debes proporcionar un enlace en el parámetro "link".' });
    }

    try {
        console.log('Analizando el enlace:', link);

        // Solicitar la página del enlace público
        const response = await axios.get(link);

        // Cargar el contenido HTML
        const $ = cheerio.load(response.data);

        // Buscar el enlace de descarga
        const directLink = $('a:contains("Descargar")').attr('href') || $('a:contains("Download")').attr('href');

        if (directLink) {
            console.log('Enlace directo encontrado:', directLink);
            return res.json({ directLink });
        } else {
            console.error('No se encontró un enlace directo en la página.');
            return res.status(404).json({ error: 'No se pudo encontrar un enlace directo en la página proporcionada.' });
        }
    } catch (error) {
        console.error('Error al procesar el enlace:', error.message);
        return res.status(500).json({ error: 'Error al procesar el enlace.' });
    }
};
