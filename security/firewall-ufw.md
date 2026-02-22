## Minimal recommended firewall rules (UFW)

Assumptions:

- You deploy on a single VM.
- Only the reverse proxy (Caddy) needs public inbound.
- You manage the VM via SSH.

### 1) Enable UFW and set defaults

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

### 2) Allow SSH (restrict to your admin IPs)

Replace `<ADMIN_IP_CIDR>` (e.g. `203.0.113.10/32`):

```bash
sudo ufw allow from <ADMIN_IP_CIDR> to any port 22 proto tcp
```

### 3) Allow HTTP/HTTPS to the reverse proxy

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### 4) Enable UFW

```bash
sudo ufw enable
sudo ufw status verbose
```

### Notes

- Do **not** open Postgres (5432) or Redis (6379) publicly.
- If you run Docker, confirm your firewall strategy: some distributions require extra care to ensure UFW applies to forwarded docker traffic.

