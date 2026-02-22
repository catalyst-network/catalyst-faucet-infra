## Cloudflare DNS (example)

This is a minimal example for serving the faucet at `faucet.example.com`.

### Records

- **A** record:
  - **Name**: `faucet`
  - **IPv4 address**: `<your VM public IP>`
  - **Proxy status**:
    - For Caddy/Let’s Encrypt issuance: start with **DNS only**
    - After validating TLS: you may switch to **Proxied** if desired

Optional:

- **AAAA** record for IPv6 (if your VM has stable IPv6)

### TLS mode notes

- If **DNS only**: Caddy can obtain certs from Let’s Encrypt via ACME.
- If **Proxied**:
  - Use Cloudflare “Full (strict)”.
  - Consider Cloudflare Origin CA certs on the origin (example in `Caddyfile`).

