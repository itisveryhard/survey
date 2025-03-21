import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    return {
        plugins: [
            vue(),
            tailwindcss(),
            visualizer()
        ],
        server: {
            proxy: {
                '/api': env?.VITE_API_URL || 'https://demo.x5.dev.iseck.com',
            }
        }
    }
})
