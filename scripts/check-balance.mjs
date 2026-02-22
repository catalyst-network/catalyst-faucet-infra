#!/usr/bin/env node

import { JsonRpcProvider, formatEther } from "ethers";

function req(name) {
  const v = process.env[name];
  if (!v || !String(v).trim()) throw new Error(`Missing required env var: ${name}`);
  return String(v).trim();
}

function opt(name) {
  const v = process.env[name];
  return v && String(v).trim() ? String(v).trim() : undefined;
}

function parseThreshold(v) {
  if (v == null) return null;
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) throw new Error(`Invalid BALANCE_WARN_LT_KAT: ${v}`);
  return n;
}

const rpcUrl = req("RPC_URL");
const address = req("FAUCET_ADDRESS");
const warnLt = parseThreshold(opt("BALANCE_WARN_LT_KAT"));

const provider = new JsonRpcProvider(rpcUrl);
const balWei = await provider.getBalance(address);
const balKAT = Number(formatEther(balWei));

const line = `balance_kat=${balKAT} address=${address}`;
if (warnLt != null && balKAT < warnLt) {
  console.error(`LOW_BALANCE ${line} threshold_kat=${warnLt}`);
  process.exit(2);
}

console.log(`OK ${line}`);
