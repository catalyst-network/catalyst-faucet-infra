## Runbook: Postgres backups + retention

This stack includes an optional `postgres_backup` service that runs scheduled `pg_dump` backups.

Backups are stored on the host at:

- `/opt/catalyst-faucet/backups`

### Enable backups

The production compose already includes `postgres_backup`. Ensure:

- `/opt/catalyst-faucet/backups` exists and is writable
- `/opt/catalyst-faucet/env/postgres.env` has strong credentials and `chmod 600`

Start (or restart) the backup service:

```bash
cp /opt/catalyst-faucet/env/caddy.env ./.env
docker-compose -f docker-compose.prod.yml up -d postgres_backup
```

### Configure retention

Edit `docker-compose.prod.yml` for the `postgres_backup` service:

- `SCHEDULE` (cron-like; default `@daily`)
- `BACKUP_KEEP_DAYS` (default `14`)

### Validate backups

List backups:

```bash
ls -la /opt/catalyst-faucet/backups
```

Check container logs:

```bash
docker logs --tail=200 catalyst-faucet-postgres_backup-1
```

### Restore test (recommended quarterly)

1) Create a scratch database (or restore to a staging instance).
2) Restore from a chosen dump using `psql`/`pg_restore` depending on dump format.

General pattern:

```bash
# Example assumes a plain SQL dump file
psql "postgresql://postgres:<password>@127.0.0.1:5432/faucet" < /opt/catalyst-faucet/backups/<dump.sql>
```

### Notes

- Keep VM-level disk alerts: backups can fill disks silently.
- For higher assurance, copy backups off-host (object storage) and encrypt at rest.

