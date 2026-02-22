## Cloudflare Turnstile (example)

The faucet uses Turnstile to block basic automation before any on-chain action.

### Create a Turnstile site

In Cloudflare dashboard:

- Go to **Turnstile**
- Create a new widget/site
- Add allowed domains:
  - `faucet.example.com`
  - (optional) your staging domain

You will get:

- **Site key** (public): put into `/opt/catalyst-faucet/env/web.env` as `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- **Secret key** (server-side): put into `/opt/catalyst-faucet/env/backend.env` as `TURNSTILE_SECRET_KEY`

### Verify end-to-end

1) Load the faucet UI and confirm the Turnstile widget renders.
2) Submit a request:
   - Success should return a tx hash link to `https://explorer.catalystnet.org/tx/<txHash>`.
3) Confirm backend rejects missing/invalid tokens (should return a clear error message).

