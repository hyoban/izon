#!/usr/bin/env node
import { consola } from "consola"
import { hideBin } from "yargs/helpers"
import yargs from "yargs/yargs"

import { getDependents } from ".."

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option("limit", {
      alias: "l",
      type: "number",
      default: 10,
    })
    .option("timeout", {
      alias: "t",
      type: "number",
      default: 8000,
    })
    .option("silent", {
      alias: "s",
      type: "boolean",
      default: false,
    })
    .parse()

  const targets = argv._.map(String)

  for (const target of targets) {
    try {
      const { result } = await getDependents(target, {
        limit: argv.limit,
        timeout: argv.timeout,
        silent: argv.silent,
      })
      console.table(result)
    } catch (error) {
      consola.error(error)
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
