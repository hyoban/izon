import { describe, expect, it } from "vitest"

import { parseDependents } from "."

describe("should", () => {
  it("exported", async () => {
    const dependents = await parseDependents(
      "https://github.com/huozhi/bunchee/network/dependents",
    )
    expect(dependents.result.length).toMatchInlineSnapshot(`30`)
  })
})
