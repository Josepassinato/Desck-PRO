#!/bin/bash
set -euo pipefail

PROJECT_DIR="/root/Desck-PRO"
NGINX_CONF="desckpro.12brain.org"

echo "=== Desck-PRO Deploy ==="

# 1. Build
echo "[1/4] Building..."
cd "$PROJECT_DIR"
npm run build

# 2. Nginx config
echo "[2/4] Configurando Nginx..."
if [ ! -f "/etc/nginx/sites-available/$NGINX_CONF" ]; then
    cp "$PROJECT_DIR/nginx.conf" "/etc/nginx/sites-available/$NGINX_CONF"
    ln -sf "/etc/nginx/sites-available/$NGINX_CONF" "/etc/nginx/sites-enabled/$NGINX_CONF"
    echo "  Nginx config criado"
else
    echo "  Nginx config ja existe"
fi

# 3. Test & reload Nginx
echo "[3/4] Testando Nginx..."
nginx -t
systemctl reload nginx

# 4. SSL (certbot)
echo "[4/4] Verificando SSL..."
if [ ! -d "/etc/letsencrypt/live/$NGINX_CONF" ]; then
    echo "  Gerando certificado SSL..."
    certbot --nginx -d "$NGINX_CONF" --non-interactive --agree-tos --email admin@12brain.org
else
    echo "  SSL ja configurado"
fi

echo ""
echo "=== Deploy completo ==="
echo "URL: https://$NGINX_CONF"
