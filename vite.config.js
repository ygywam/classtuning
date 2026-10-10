import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // 로컬 더블클릭(file://) 및 상대 경로 리소스 로딩 호환성 확보
  plugins: [react()],
  build: {
    outDir: '공유용'
  }
})
