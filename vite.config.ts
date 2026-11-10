import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  // Caminhos relativos no Electron; caminho do GitHub Pages na versão web.
  base: mode === 'desktop' ? './' : '/conexoes-biblicas-logos/',
  plugins: [react()],
}))
