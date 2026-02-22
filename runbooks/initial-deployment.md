## Runbook: Initial deployment (single VM)

This runbook deploys the faucet securely on a single Linux VM using Docker Compose + Caddy.

### Preconditions

- **Domain** for the faucet (e.g. `faucet.example.com`)
- VM with public IPv4 (and optionally IPv6)
- Ports **80/443** reachable from the internet
- Docker Engine + Docker Compose installed
- Cloudflare Turnstile site/secret keys created for your domain
- Catalyst testnet RPC URL

### 1) Create a dedicated directory on the host

```bash
sudo mkdir -p /opt/catalyst-faucet/{env,backups}
sudo chown -R "$USER":"$USER" /opt/catalyst-faucet
chmod 700 /opt/catalyst-faucet
```

### 2) Create env files (do not commit secrets)

Copy examples and edit:

```bash
cp env/backend.env.example /opt/catalyst-faucet/env/backend.env
cp env/web.env.example /opt/catalyst-faucet/env/web.env
cp env/postgres.env.example /opt/catalyst-faucet/env/postgres.env
cp env/caddy.env.example /opt/catalyst-faucet/env/caddy.env
chmod 600 /opt/catalyst-faucet/env/*.env
```

Fill in:

- Backend: `RPC_URL`, **`CHAIN_ID=0xbf8457c`**, `FAUCET_PRIVATE_KEY`, `TURNSTILE_SECRET_KEY`, `ADMIN_TOKEN`, `IP_HASH_SALT`
- Web: `NEXT_PUBLIC_FAUCET_API_BASE_URL=https://<domain>/api`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- Postgres password
- Caddy: `FAUCET_DOMAIN`

Important:

- If you change values in `web.env` (e.g. API base URL or Turnstile site key), **rebuild** the web image after edits:

```bash
cp /opt/catalyst-faucet/env/caddy.env ./.env
docker-compose -f docker-compose.prod.yml build web
docker-compose -f docker-compose.prod.yml up -d web
```

### 3) DNS + TLS

- Point `faucet.example.com` to your VM (`A`/`AAAA` record).
- If using **Let’s Encrypt via Caddy**, ensure the record is **DNS-only** (not proxied) during issuance.
  - You can proxy later, but validate end-to-end TLS behavior first.

### 4) Minimal firewall (recommended)

Apply the rules in `security/firewall-ufw.md` (or equivalent for your host firewall).

### 5) Start the stack

From this repo:

```bash
cp /opt/catalyst-faucet/env/caddy.env ./.env
docker-compose -f docker-compose.prod.yml up -d --build
```

### 6) Verify

- UI: `https://<domain>/`
- API info: `https://<domain>/api/v1/info`
- Health: `https://<domain>/api/health`

Expected `/api/v1/info` includes:

- `chainId`: `0xbf8457c` (or `0x0bf8457c` formatting is acceptable)
- `symbol`: `KAT`
- `amount`: matches `FAUCET_AMOUNT`

### 7) Post-deploy hardening checklist

- Restrict `/api/v1/admin/*` at the edge (see the commented example block in `Caddyfile`).
- Confirm Postgres/Redis are **not** exposed publicly (they’re on an internal docker network).
- Store `backend.env` with `chmod 600` and in your secret manager / vault as the source of truth.

