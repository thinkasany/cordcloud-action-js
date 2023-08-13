# 使用官方 Node.js 镜像作为基础镜像
FROM node:14

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 文件到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制应用程序源代码到工作目录
COPY ..

# 暴露应用程序的端口（根据实际项目需要调整）
EXPOSE 3000

# 启动应用程序
CMD ["node", "main.js"]
