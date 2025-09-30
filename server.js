import Fastify from 'fastify'
import cors from '@fastify/cors'
import { config } from 'dotenv'

// Cargar variables de entorno
config({ path: '.env.local' })

// Crear instancia de Fastify
const fastify = Fastify({
    logger: true // Logs automáticos para debugging
})

// Registrar CORS - Configuración optimizada para desarrollo
await fastify.register(cors, {
    origin: ['http://localhost:3000'], // Solo tu frontend
    methods: ['GET', 'POST'],
    credentials: true
})

// Tu endpoint API (adaptado de Vercel)
fastify.post('/api/generate', async (request, reply) => {
    try {
        const body = request.body

        // Determinar modelo (tu lógica actual)
        let modelName
        if (body.modelType === 'image') {
            modelName = 'gemini-2.5-flash-image-preview'
        } else if (body.modelType === 'text') {
            modelName = 'gemini-2.5-flash-preview-05-20'
        } else {
            // Autodetección
            if (body.generationConfig && body.generationConfig.responseModalities) {
                modelName = 'gemini-2.5-flash-image-preview'
            } else {
                modelName = 'gemini-2.5-flash-preview-05-20'
            }
        }

        const cleanPayload = { ...body }
        delete cleanPayload.modelType

        // API call a Gemini
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cleanPayload)
        })

        const result = await response.json()

        reply.code(response.status)
        return result

    } catch (error) {
        reply.code(500)
        return {
            error: 'Error interno del servidor',
            details: error.message
        }
    }
})

// Iniciar servidor
const start = async () => {
    try {
        await fastify.listen({ port: 3001, host: '127.0.0.1' })
        console.log('🚀 Fastify API corriendo en http://localhost:3001')
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()
