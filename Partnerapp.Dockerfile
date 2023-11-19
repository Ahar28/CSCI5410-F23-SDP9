FROM node:16.15.1 as build

WORKDIR /PartnerApp

ARG src="/Partner App/Frontend/partner-app/package.json"

ARG rootsrc="/Partner App/Frontend/partner-app/"

# ARG nginxsrc="/Customer App/Frontend/customer-app/nginx/nginx.conf"

COPY ${src} .

RUN npm install

COPY ${rootsrc} .

RUN npm install --legacy-peer-deps

RUN npm run build

FROM nginx:1.19

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=build /PartnerApp/build /usr/share/nginx/html