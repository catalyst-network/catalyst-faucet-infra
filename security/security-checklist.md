## Security checklist (production)

### Secrets & access

- [ ] **No secrets in git**: env files containing secrets live on the server only.
- [ ] `/opt/catalyst-faucet/env/*.env` is `chmod 600` and readable only by the deploy user (or root).
- [ ] `FAUCET_PRIVATE_KEY` is stored in a secret manager (source of truth) and rotated if exposed.
- [ ] `ADMIN_TOKEN` is long, random, and rotated periodically.
- [ ] `IP_HASH_SALT` is long, random, and kept secret (never logged).

### Network / firewall

- [ ] Only **80/443** are publicly accessible (and **22** restricted to admin IPs).
- [ ] Postgres and Redis are **not** exposed on the public interface.
- [ ] `/api/v1/admin/*` is IP-restricted at the reverse proxy (defense in depth).

### TLS

- [ ] HTTPS is enforced; HSTS enabled if you will keep HTTPS permanently.
- [ ] If using Cloudflare proxy, validate your “Full (strict)” mode end-to-end.

### Chain safety (testnet-only)

- [ ] Backend `CHAIN_ID` is set to `0xbf8457c`.
- [ ] Backend refuses to start on other chainIds (allowlist guard).
- [ ] RPC URL is verified as **testnet** before first deployment and after any change.

### Abuse & rate limiting

- [ ] Turnstile enabled and working (verify both site key and secret).
- [ ] Cooldown configured (per-address + per-IP).
- [ ] Global RPM configured and monitored.
- [ ] Optional country/ASN limits enabled only when your edge supplies correct headers.

### Observability

- [ ] Uptime checks on `GET /api/health`.
- [ ] Alerts on 5xx rate spikes and 503 upstream failures.
- [ ] Alerts on low faucet hot wallet balance.

### Data protection

- [ ] Postgres backups enabled with retention policy.
- [ ] Backups tested for restore (at least quarterly).
- [ ] VM disk space alerts configured (data + backups).

