# VPS + Cloudflare Operator Runbook

This runbook is intended for direct execution when access is available.

## 1. Variables To Set Locally

```bash
export VPS_HOST=""
export VPS_PORT="22"
export VPS_USER=""
export DOMAIN="example.com"
export APP_HOST="app.${DOMAIN}"
export API_HOST="api.${DOMAIN}"
export CF_TOKEN=""
export CF_ACCOUNT_ID=""
```

## 2. VPS Base Provisioning

```bash
ssh -p "$VPS_PORT" "$VPS_USER@$VPS_HOST"
sudo apt update && sudo apt -y upgrade
sudo apt -y install nginx ufw fail2ban git curl unzip
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt -y install nodejs
sudo npm i -g pm2
node -v && npm -v && pm2 -v
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

## 3. Backend Deployment On VPS

```bash
sudo mkdir -p /srv/veritas
sudo chown -R "$USER:$USER" /srv/veritas
cd /srv/veritas
git clone https://github.com/zebadee2kk/Veritas-News-Hub.git
cd Veritas-News-Hub/veritas-global-intelligence
npm ci
npm run build
```

Create backend environment file:

```bash
sudo tee /etc/veritas.env > /dev/null <<'EOF'
NODE_ENV=production
PORT=3000
GEMINI_API_KEY=
NEWS_API_KEY=
GOOGLE_MAPS_PLATFORM_KEY=
TWITTER_BEARER_TOKEN=
GROK_API_KEY=
EOF
sudo chmod 600 /etc/veritas.env
```

Start app with PM2:

```bash
cd /srv/veritas/Veritas-News-Hub/veritas-global-intelligence
pm2 start "npx tsx server.ts" --name veritas-api --update-env
pm2 save
pm2 startup systemd -u "$USER" --hp "/home/$USER"
```

Run the command output from `pm2 startup` when prompted.

## 4. Nginx Reverse Proxy

Create site config:

```nginx
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/veritas-api /etc/nginx/sites-enabled/veritas-api
sudo nginx -t
sudo systemctl reload nginx
```

## 5. Cloudflare DNS + TLS

1. Create DNS records:
- `api` A/AAAA -> VPS IP, proxied on
- `app` CNAME -> Cloudflare Pages project hostname, proxied on

2. Set SSL mode to Full (strict).

3. Enable:
- Managed WAF rules
- Rate limiting for API endpoints
- Optional bot mitigation

## 6. Cloudflare Pages Frontend

Build settings:

- Framework preset: Vite
- Root directory: `veritas-global-intelligence`
- Build command: `npm run build`
- Build output directory: `dist`

Set frontend-safe environment variable(s):

- `VITE_API_BASE_URL=https://api.<domain>`

Bind custom domain:

- `app.<domain>`

## 7. Validation

- `https://api.<domain>/health` responds 200.
- Frontend loads at `https://app.<domain>`.
- Frontend API requests succeed without CORS errors.
- No secret values appear in frontend source maps or JS bundles.

## 8. Rollback

- Frontend: promote previous Cloudflare Pages deployment.
- Backend: restore previous release and `pm2 restart veritas-api`.
- DNS fallback: adjust Cloudflare DNS records if needed.
