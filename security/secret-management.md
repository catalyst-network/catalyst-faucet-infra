## Secret management approach (recommended)

### Principles

- **No secrets in git** (ever).
- Keep secrets in a **secret manager** as the source of truth.
- On the VM, write secrets into env files with strict OS permissions.

### On-host layout

Create:

- `/opt/catalyst-faucet/env/backend.env` (contains secrets)
- `/opt/catalyst-faucet/env/postgres.env` (contains DB password)
- `/opt/catalyst-faucet/env/web.env` (public, but still treated as config)
- `/opt/catalyst-faucet/env/caddy.env` (domain and non-secret config)

Recommended permissions:

```bash
sudo chown -R root:root /opt/catalyst-faucet/env
sudo chmod 700 /opt/catalyst-faucet/env
sudo chmod 600 /opt/catalyst-faucet/env/*.env
```

If you run docker compose as a non-root deploy user, ensure only that user (and root) can read the env files.

### Rotation strategy

- **FAUCET_PRIVATE_KEY**: rotate on suspicion of exposure; keep hot wallet balance small.
- **ADMIN_TOKEN**: rotate periodically; also IP-restrict admin endpoints at the proxy.
- **TURNSTILE_SECRET_KEY**: rotate if leaked (Cloudflare dashboard).
- **POSTGRES_PASSWORD**: rotate with planned downtime (requires updating `DATABASE_URL` and DB password).

### Avoiding accidental leakage

- Do not print env files in logs.
- Avoid `docker inspect` / `ps` outputs in shared channels.
- Use restricted shell history / secure paste policies for secrets.

