FROM node:16.18.1-buster as build-stage
# 多阶段构建：build阶段每次会构建出none images,需要系统做定时清理
COPY . /data/
WORKDIR /data/
RUN npm config set registry https://registry.npm.taobao.org
RUN npm i -g npm@9.5.1
RUN npm install
RUN npm run build

FROM nginx:alpine3.17-slim as production-stage
# 多阶段构建：这才是最终构建出的images
MAINTAINER zhangweilong 113998274@qq.com
ENV LANG C.UTF-8
ENV TZ=Asia/Shanghai
COPY --from=build-stage /data/dist /usr/share/nginx/html/
EXPOSE 80 443
CMD ["nginx","-g","daemon off;"]
