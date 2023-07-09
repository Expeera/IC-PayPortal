import { defineConfig } from "vite"
import { VitePWA } from 'vite-plugin-pwa'

import reactRefresh from "@vitejs/plugin-react-refresh"
import path from "path"
import dfxJson from "./dfx.json"
import fs from "fs"
import { json } from "stream/consumers"

const isDev = process.env["DFX_NETWORK"] !== "ic"

type Network = "ic" | "local"

interface CanisterIds {
  [key: string]: { [key in Network]: string }
}

let canisterIds: CanisterIds = {}
try {
  canisterIds = JSON.parse(
    fs
      .readFileSync(
        isDev ? ".dfx/local/canister_ids.json" : "./canister_ids.json",
      )
      .toString(),
  )
} catch (e) {
  console.error("\n⚠️  Before starting the dev server run: dfx deploy\n\n")
}

// List of all aliases for canisters
// This will allow us to: import { canisterName } from "canisters/canisterName"
const aliases = Object.entries(dfxJson.canisters).reduce(
  (acc, [name, _value]) => {
    // Get the network name, or `local` by default.
    const networkName = process.env["DFX_NETWORK"] ?? "local"
    const outputRoot = path.join(
      __dirname,
      ".dfx",
      networkName,
      "canisters",
      name,
    )

    return {
      ...acc,
      ["canisters/" + name]: path.join(outputRoot, "index" + ".js"),
    }
  },
  {},
)

// Generate canister ids, required by the generated canister code in .dfx/local/canisters/*
// This strange way of JSON.stringifying the value is required by vite
const canisterDefinitions = Object.entries(canisterIds).reduce(
  (acc, [key, val]) => ({
    ...acc,
    [`${key.toUpperCase()}_CANISTER_ID`]: isDev
      ? (val.local)
      : (val.ic),
  }),
  {},
)
console.log({ canisterDefinitions: JSON.stringify(canisterDefinitions) })
// Gets the port dfx is running on from dfx.json
const DFX_PORT = dfxJson.networks.local.bind.split(":")[1]

// See guide on how to configure Vite at:
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh() //, VitePWA({ registerType: 'autoUpdate' })
  ],
  resolve: {
    alias: {
      // Here we tell Vite the "fake" modules that we want to define
      ...aliases,
    },
  },
  server: {
    fs: {
      allow: ["."],
    },
    proxy: {
      // This proxies all http requests made to /api to our running dfx instance
      "/api": {
        target: `http://0.0.0.0:${DFX_PORT}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
  define: {
    // Here we can define global constants
    // This is required for now because the code generated by dfx relies on process.env being set
    process: {
      env: {
        ...canisterDefinitions,
        II_URL: isDev
          ? `http://localhost:8000?canisterId=${canisterIds["identity"]['local']}#authorize`
          : "https://identity.ic0.app/#authorize",
        // II_URL: "https://identity.ic0.app/#authorize",
        "NODE_ENV": JSON.stringify(
          isDev ? "development" : "production",
        ),

      }
    }
  },
})
