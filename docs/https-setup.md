## HTTPS setup options

This repo uses **Caddy** as the reverse proxy.

### Option A (simplest): Direct HTTPS with Let’s Encrypt (ACME)

Use when:

- Your DNS record is **DNS-only** (not proxied), or Cloudflare proxy is disabled during issuance
- Ports **80** and **443** are reachable from the internet

Steps:

1) Set `FAUCET_DOMAIN` in `/opt/catalyst-faucet/env/caddy.env`.
2) Ensure DNS `A/AAAA` points at the VM.
3) Start the stack:

```bash
docker compose -f docker-compose.prod.yml --env-file /opt/catalyst-faucet/env/caddy.env up -d
```

Caddy will automatically obtain and renew certificates.

### Option B: Cloudflare proxied + Origin CA certificate

Use when:

- You want Cloudflare proxy in front (“orange cloud”)
- You prefer Origin CA certs and set Cloudflare to **Full (strict)**

Steps:

1) In Cloudflare, generate an **Origin Certificate** for `faucet.example.com` (and optionally `*.example.com`).
2) Put files on the VM:

- `/opt/catalyst-faucet/env/certs/origin.pem`
- `/opt/catalyst-faucet/env/certs/origin.key`

3) Mount certs in `docker-compose.prod.yml` (uncomment the cert mount).
4) In `Caddyfile`, uncomment the `tls /etc/caddy/certs/origin.pem /etc/caddy/certs/origin.key` line.
5) Enable Cloudflare proxy and set SSL/TLS mode to **Full (strict)**.

### Notes

- Prefer **Full (strict)**, not “Flexible”.
- Validate the origin is not directly exposing other ports besides 80/443.

