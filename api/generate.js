export default async function handler(req, res) {
    // Headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const body = req.body;

        // Determinar modelo
        let modelName;
        if (body.modelType === 'image') {
            modelName = 'gemini-2.5-flash-image-preview';
        } else if (body.modelType === 'text') {
            modelName = 'gemini-2.5-flash-preview-05-20';
        } else {
            // Autodetección
            if (body.generationConfig && body.generationConfig.responseModalities) {
                modelName = 'gemini-2.5-flash-image-preview';
            } else {
                modelName = 'gemini-2.5-flash-preview-05-20';
            }
        }

        const cleanPayload = { ...body };
        delete cleanPayload.modelType;

        // API KEY desde variables de entorno de Vercel
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cleanPayload)
        });

        const result = await response.json();
        return res.status(response.status).json(result);

    } catch (error) {
        return res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message
        });
    }
}
