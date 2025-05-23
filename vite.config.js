import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vite.dev/config/
export default defineConfig({
plugins: [react()],
server: {
  allowedHosts: true,
  host: true,
  strictPort: true,
  port: 5173,
  cors: true,
  origin: 'https://dev--bdd169c65a224ce987907120141eb50b.aitester.io',
  hmr: {
    host: 'dev--bdd169c65a224ce987907120141eb50b.aitester.io',
    port: 443,
    protocol: 'wss'
  }
}})