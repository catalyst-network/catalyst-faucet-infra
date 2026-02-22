## Runbook: Rotate faucet hot wallet key

Rotate the faucet key if you suspect exposure, as part of scheduled hygiene, or before sharing logs/configs.

### Goals

- Move funds off the old faucet address (if any).
- Update `FAUCET_PRIVATE_KEY`.
- Resume service with minimal downtime.

### 0) Identify the current faucet address

Derive the address locally (never paste private keys into web tools):

```bash
node -e "const {Wallet}=require('ethers'); console.log(new Wallet(process.env.FAUCET_PRIVATE_KEY).address)"
```

Run it with the env loaded:

```bash
set -a && source /opt/catalyst-faucet/env/backend.env && set +a
node -e "const {Wallet}=require('ethers'); console.log(new Wallet(process.env.FAUCET_PRIVATE_KEY).address)"
```

### 1) Pause the faucet (optional but recommended)

Set `ADMIN_TOKEN` and call the pause endpoint (prefer from a restricted network):

```bash
curl -sS -X POST "https://<domain>/api/v1/admin/pause" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

### 2) Create the new hot wallet key

- Generate a new keypair on an offline machine or using a trusted process.
- Store it in your secret manager.

### 3) Fund the new hot wallet

Send a small amount of testnet KAT first, verify on explorer:

- Explorer: `https://explorer.catalystnet.org`
- Tx URL template: `https://explorer.catalystnet.org/tx/<txHash>`

Then fund with the expected operational balance.

### 4) Update secrets on the server

Edit:

- `/opt/catalyst-faucet/env/backend.env` → set `FAUCET_PRIVATE_KEY=...`

Confirm permissions:

```bash
sudo stat -c "%a %U %G %n" /opt/catalyst-faucet/env/backend.env
```

Recommended: `600` owned by `root` or the deploy user only.

### 5) Restart backend

```bash
cp /opt/catalyst-faucet/env/caddy.env ./.env
docker-compose -f docker-compose.prod.yml up -d backend
```

Check health:

```bash
curl -fsS "https://<domain>/api/health" >/dev/null && echo ok
```

### 6) Unpause

```bash
curl -sS -X POST "https://<domain>/api/v1/admin/unpause" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

### 7) Post-rotation cleanup

- Revoke/rotate any credentials that could have exposed the old key (CI secrets, shell history, etc.).
- If the old faucet address still holds funds, transfer them to treasury or the new hot wallet.

