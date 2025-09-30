import { defineConfig } from 'vite'

export default defineConfig({
    // ❌ ELIMINAR ESTA LÍNEA: base: '/',

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
