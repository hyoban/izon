import { hideBin } from "yargs/helpers"
import yargs from "yargs/yargs"

import { getDependents } from ".."

const argv = await yargs(hideBin(process.argv))
  .option("limit", {
    alias: "l",
    type: "number",
    default: 10,
  })
  .option("maxPage", {
    alias: "m",
    type: "number",
    default: 10,
  })
  .parse()

const targets = argv._.map(String)

for (const target of targets) {
  const { result } = await getDependents(target, {
    limit: argv.limit,
    maxPage: argv.maxPage,
  })
  console.table(result)
}
