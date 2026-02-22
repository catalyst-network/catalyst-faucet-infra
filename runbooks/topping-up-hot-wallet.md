## Runbook: Top up faucet hot wallet from cold treasury

The faucet uses a **hot wallet** (private key in `backend.env`) to sign native KAT transfers.
Top-ups should come from a **cold treasury** (hardware wallet / multisig) with strict controls.

### Safety checks (do these every time)

- **Confirm chainId** is Catalyst testnet: `0xbf8457c`
- Confirm the RPC URL points to testnet (not mainnet)
- Confirm recipient address matches the faucet hot wallet address you intend to fund

### 1) Identify the faucet hot wallet address

On the server:

```bash
set -a && source /opt/catalyst-faucet/env/backend.env && set +a
node -e "const {Wallet}=require('ethers'); console.log(new Wallet(process.env.FAUCET_PRIVATE_KEY).address)"
```

Record it in your ops docs (address only, never the key).

### 2) Decide top-up amount and thresholds

Recommended approach:

- Choose an **alert threshold** (e.g. 1–2 days of expected usage)
- Choose a **target balance** (e.g. 7–14 days of expected usage)

Balance burn-rate depends on:

- `FAUCET_AMOUNT`
- expected requests/day
- variance/spikes and your rate-limits

### 3) Send from cold treasury

From your cold treasury wallet (hardware/multisig):

- Send native KAT to the faucet hot wallet address
- Verify the tx on explorer: `https://explorer.catalystnet.org`

### 4) Verify arrival + update monitoring notes

- Verify the confirmed balance on explorer.
- If you have low-balance alerts, ensure the threshold reflects new operating policy.

### 5) Incident note (if needed)

If the faucet runs out of funds unexpectedly:

- pause the faucet (`/api/v1/admin/pause`)
- investigate request spikes / abuse signals
- top up
- unpause

