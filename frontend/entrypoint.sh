#!/bin/sh
set -e

# Genera config.js con la URL del backend definida en tiempo de despliegue
envsubst '${API_BASE_URL}' < /usr/share/nginx/html/config.js.template > /usr/share/nginx/html/config.js

exec nginx -g 'daemon off;'
