import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import laravel from 'laravel-vite-plugin'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/index.ts'],
            refresh: true,
        }),
        tailwindcss(),
        react(),
    ],
    // esbuild: {
    //     jsx: 'automatic',
    // },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
})
