/**
 * Drive Cursor browser via CDP-style timing by printing instructions.
 * Actual measurement is done by the agent with browser_cdp navigation.
 * This file documents expected URLs/params.
 */
export const URLS = {
  preprod:
    "https://hbsg.dxp1.preprod.eu.dynp.cloud1.vv1865.com/hsbc/dxp/challenge.js",
  awswaf: "https://hsbc.edge.sdk.awswaf.com/hsbc/dxp/challenge.js",
};
export const ROUNDS = 5;
export const DELAY_MS = 3000;
