# ---------- Etapa única: Nginx ----------
# (No hay build de assets, es HTML/JS plano, pero mantenemos capas mínimas)
FROM nginx:1.27-alpine

# gettext trae 'envsubst', necesario para inyectar la variable de entorno
RUN apk add --no-cache gettext

WORKDIR /usr/share/nginx/html

COPY index.html style.css app.js config.js.template ./
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Variable de entorno por defecto (se sobreescribe en docker-compose / ECS)
ENV API_BASE_URL=http://localhost:8080

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
