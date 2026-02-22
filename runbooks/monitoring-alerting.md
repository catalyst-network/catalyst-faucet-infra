## Runbook: Monitoring & alerting (recommended minimum)

You want early warning for:

- low faucet balance
- high error rate / upstream failure
- abuse spikes (rate-limit hits / unusual request volumes)
- DB health (disk full, connection errors)

### Signals to capture

- **API health**: `GET /api/health` (200 OK + `ok: true`)
- **Error rate**: count of non-2xx on `/api/v1/request`
- **Cooldown/rate-limit volume**:
  - 429 responses (cooldown) and their frequency
  - 503 upstream unavailable (RPC/Turnstile failures)
- **RPC failures**: backend logs and `/api/health` status changes
- **Postgres**:
  - disk usage on the VM
  - backup job success
- **Redis**: memory usage (optional), readiness
- **Hot wallet balance** (external check)

### Minimal alerting checklist

- **Low balance**
  - Alert when faucet hot wallet balance < threshold.
  - Implement via a small scheduled job (cron) calling RPC `eth_getBalance` and alerting (PagerDuty/Email/Slack).

- **API down**
  - Uptime check `https://<domain>/api/health` every 30–60s.
  - Alert on 2+ consecutive failures.

- **High error rate**
  - Alert if 5xx rate for `/api/v1/request` exceeds a threshold (e.g. >2% over 5 minutes).

- **Abuse / spikes**
  - Alert on sudden increase in requests/min or sustained 429s (may indicate bot activity).

### Practical implementation options

- **Simple**: Uptime Kuma + a cron script for balance + email alerts
- **More complete**: Prometheus + Grafana + Loki/Promtail (ship JSON logs), with alerting rules
- **Cloud-native**: managed metrics/logs (Datadog, Grafana Cloud, etc.)

### Suggested dashboard widgets

- Requests/min, 2xx/4xx/5xx breakdown
- 429 counts (cooldown active)
- 503 counts (upstream unavailable)
- `/api/health` status timeline
- Postgres disk usage, backup success/failure

### Incident response quick actions

- Pause claims: `POST /api/v1/admin/pause`
- Verify upstreams:
  - RPC reachable
  - Turnstile verification success
  - Redis + Postgres healthy
- If abuse: tighten limits (cooldown/global RPM) and add edge restrictions

