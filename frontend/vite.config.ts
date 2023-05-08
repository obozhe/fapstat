import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths(), svgr()],
    build: {
        outDir: '../build/static',
    },
    resolve: {
        alias: [
            { find: '@images', replacement: path.resolve(__dirname, 'src/assets/images') },
            { find: '@components/*', replacement: path.resolve(__dirname, 'src/components') },
            { find: '@pages/*', replacement: path.resolve(__dirname, 'src/pages') },
            { find: '@types/*', replacement: path.resolve(__dirname, 'src/types') },
            { find: '@utils/*', replacement: path.resolve(__dirname, 'src/utils') },
            { find: '@routes/*', replacement: path.resolve(__dirname, 'src/routes') },
            { find: '@services/*', replacement: path.resolve(__dirname, 'src/services') },
            { find: '@ui/*', replacement: path.resolve(__dirname, 'src/components/ui') },
            { find: '@features/*', replacement: path.resolve(__dirname, 'src/features') },
            { find: '@dialogs/*', replacement: path.resolve(__dirname, 'src/components/dialogs') },
            { find: '@forms/*', replacement: path.resolve(__dirname, 'src/components/forms') },
            { find: '@services/*', replacement: path.resolve(__dirname, 'src/services') },
        ],
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5050',
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
