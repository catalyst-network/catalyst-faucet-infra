# Catalyst Faucet Infra + Runbooks

Infrastructure and operational runbooks for deploying the Catalyst **testnet-only** faucet:

- `catalyst-faucet` (backend API; Fastify + ethers + Redis + Postgres)
- `catalyst-faucet-web` (web UI; Next.js)
- Reverse proxy with **TLS** (Caddy)

This repo is designed to be used with Docker Compose on a single VM (or small instance).

## Scope / guardrails

- **Chain**: Catalyst testnet (Ethereum-style JSON-RPC)
- **Native token**: KAT (native transfers, not ERC-20)
- **Explorer**: `https://explorer.catalystnet.org` (tx template: `https://explorer.catalystnet.org/tx/<txHash>`)
- **Testnet only**: backend enforces a chainId allowlist; **mainnet is out of scope**
- **Required CHAIN_ID**: `0xbf8457c`

## Repository layout

- `docker-compose.prod.yml`: production compose (backend + web + redis + postgres + caddy)
- `Caddyfile`: TLS reverse proxy + routing (`/api/*` → backend, `/` → web)
- `env/`: **example** env files (copy to host; do not commit real secrets)
- `runbooks/`: operational runbooks (deployment, key rotation, top-ups, backups, monitoring)
- `security/`: security checklist + minimal firewall rules
- `cloudflare/`: example Cloudflare DNS + Turnstile setup notes

## Quick start (production VM)

On your VM:

```bash
sudo mkdir -p /opt/catalyst-faucet/{env,data,backups}
sudo chown -R "$USER":"$USER" /opt/catalyst-faucet
chmod 700 /opt/catalyst-faucet

cp env/backend.env.example /opt/catalyst-faucet/env/backend.env
cp env/web.env.example /opt/catalyst-faucet/env/web.env
cp env/postgres.env.example /opt/catalyst-faucet/env/postgres.env
cp env/caddy.env.example /opt/catalyst-faucet/env/caddy.env

# edit the env files (backend.env contains secrets)
chmod 600 /opt/catalyst-faucet/env/*.env
```

Bring the stack up:

```bash
cp /opt/catalyst-faucet/env/caddy.env ./.env
docker-compose -f docker-compose.prod.yml up -d --build
```

Then:

- UI: `https://<YOUR_DOMAIN>/`
- API (proxied): `https://<YOUR_DOMAIN>/api/v1/info`
- Health: `https://<YOUR_DOMAIN>/api/health`

## Documentation

- Runbooks live in `runbooks/`
- Security checklist in `security/security-checklist.md`
- HTTPS setup options in `docs/https-setup.md`
- Secret handling in `security/secret-management.md`

