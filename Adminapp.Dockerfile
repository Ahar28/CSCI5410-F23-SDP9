FROM node:16.15.1 as build

WORKDIR /AdminApp

ARG src="/Admin App/Frontend/admin-app/package.json"

ARG rootsrc="/Admin App/Frontend/admin-app/"

# ARG nginxsrc="/Customer App/Frontend/customer-app/nginx/nginx.conf"
#added commment to trigger deploment

COPY ${src} .

RUN npm install

COPY ${rootsrc} .

RUN npm install --legacy-peer-deps

RUN npm run build

FROM nginx:1.19

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=build /AdminApp/build /usr/share/nginx/html