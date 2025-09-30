import { defineConfig } from 'vite'

export default defineConfig({
    // Configuración específica para Vercel
    base: '/', // Importante para Vercel

    server: {
        port: 3000,
        open: true,
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                secure: false,
            }
        }
    },

    build: {
        outDir: 'dist',
        emptyOutDir: true,
        target: 'esnext',
        // Configuración específica para Vercel
        assetsDir: 'assets',
        rollupOptions: {
            input: {
                main: 'index.html'
            }
        }
    },

    optimizeDeps: {
        include: [],
        exclude: []
    }
})
