import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Tải các biến môi trường từ tệp .env
  const { PORT } = process.env;

  return {
    plugins: [
      tsconfigPaths(),
      react(),
      checker({
        typescript: true,
        eslint: {
          lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
        },
      }),
    ],
    define: {
      'process.env': {
        PORT: PORT || 4001, // Sử dụng PORT từ biến môi trường hoặc mặc định là 4001
      },
    },
    server: {
      port: PORT ? +PORT : 4001, // Chuyển đổi PORT thành số và sử dụng mặc định nếu không có
      host: true, // Để có thể truy cập từ địa chỉ IP
    },
    preview: {
      port: PORT ? +PORT : 4001, // Chuyển đổi PORT thành số và sử dụng mặc định nếu không có
    },
    base: '/',
  };
});