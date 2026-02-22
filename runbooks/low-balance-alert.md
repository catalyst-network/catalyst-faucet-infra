## Runbook: Low balance alerting (hot wallet)

This repo includes `scripts/check-balance.mjs` to support simple cron-based alerting.

### What you need

- RPC URL (`RPC_URL`)
- Faucet hot wallet **address** (not private key): `FAUCET_ADDRESS`
- Warning threshold in KAT: `BALANCE_WARN_LT_KAT`

### Example: manual run

```bash
RPC_URL="https://your-catalyst-testnet-rpc.example" \
FAUCET_ADDRESS="0x0000000000000000000000000000000000000000" \
BALANCE_WARN_LT_KAT="10" \
node scripts/check-balance.mjs
```

Exit codes:

- `0`: OK
- `2`: low balance (below threshold)

### Cron example

Run every 10 minutes and send mail on low balance:

```cron
*/10 * * * * RPC_URL="..." FAUCET_ADDRESS="0x..." BALANCE_WARN_LT_KAT="10" node /path/to/catalyst-faucet-infra/scripts/check-balance.mjs || echo "low faucet balance" | mail -s "Catalyst faucet low balance" ops@example.com
```

### Response steps

1) Confirm balance on explorer: `https://explorer.catalystnet.org`
2) Top up using `runbooks/topping-up-hot-wallet.md`
3) Review request volume and abuse indicators

