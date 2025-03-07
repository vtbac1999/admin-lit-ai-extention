# Sử dụng Node.js phiên bản 18 làm base image
FROM node:18 AS build

# Đặt thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt các phụ thuộc
RUN npm install

# Sao chép tất cả mã nguồn vào container
COPY . .

# Xây dựng ứng dụng
RUN npm run build

# Bước chạy ứng dụng
FROM node:18 AS production

# Đặt thư mục làm việc
WORKDIR /app

# Sao chép chỉ thư mục build từ bước build
COPY --from=build /app/dist ./dist

# Cài đặt serve để phục vụ ứng dụng
RUN npm install -g serve

# Chạy ứng dụng
CMD ["serve", "-s", "dist", "-l", "4001"]

# Expose cổng để truy cập
EXPOSE 4001