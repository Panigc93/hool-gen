import Fastify from 'fastify'
import cors from '@fastify/cors'
import { config } from 'dotenv'

config({ path: '.env.local' })

const fastify = Fastify({
  logger: true,
  bodyLimit: 10 * 1024 * 1024
})

await fastify.register(cors, {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
})

fastify.post('/api/generate', async (request, reply) => {
    try {
        const body = request.body

        let modelName
        if (body.modelType === 'image') {
            modelName = 'gemini-2.5-flash-image-preview'
        } else if (body.modelType === 'text') {
            modelName = 'gemini-2.5-flash-preview-05-20'
        } else {
            if (body.generationConfig && body.generationConfig.responseModalities) {
                modelName = 'gemini-2.5-flash-image-preview'
            } else {
                modelName = 'gemini-2.5-flash-preview-05-20'
            }
        }

        const cleanPayload = { ...body }
        delete cleanPayload.modelType

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
