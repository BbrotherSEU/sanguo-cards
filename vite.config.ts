import { defineConfig } from 'vite'
import { accountPlugin } from './server/accounts'

export default defineConfig({
  plugins: [accountPlugin()],
  server: {
    host: '127.0.0.1',
    port: 5174,
  },
  preview: {
    port: 4174,
  },
})
