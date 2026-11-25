import {defineConfig} from 'vite';
export default defineConfig({build:{rollupOptions:{input:{garden:'index.html',prototype:'prototype.html'},output:{manualChunks(id){if(id.includes('/node_modules/three/'))return 'three';if(id.includes('/node_modules/'))return 'text';}}}}});
