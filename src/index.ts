import { load } from "cheerio"
import { consola } from "consola"
import { $fetch } from "ofetch"

export type DependentInfo = {
  repository: string
  stars: number
  forks: number
}

export type ParseResult = {
  nextUrl?: string
  result: DependentInfo[]
}

function toNumber(value?: string): number {
  // remove number separator
  return Number(value?.replace(",", ""))
}

export async function parseDependents(url: string): Promise<ParseResult> {
  const html = await $fetch<string>(url)
  const $ = load(html)
  const dependentDomList = $(
    "#dependents .Box [data-test-id='dg-repo-pkg-dependent']",
  )
  const nextButton = $("#dependents .paginate-container .BtnGroup a").filter(
    (_, dom) => $(dom).text().includes("Next"),
  )
  const nextUrl = nextButton.attr("href")

  const dependentList = dependentDomList
    .map((_, dom) => {
      const dependent = $(dom)
        .find("a[data-hovercard-type='repository']")
        .attr("href")
        ?.slice(1)
      const info = $(dom)
        .find(".color-fg-muted.text-bold.pl-3")
        .map((_, dom) => $(dom).text())
        .get()
      const stars = toNumber(info.at(0))
      const forks = toNumber(info.at(1))

      return {
        repository: dependent ?? "",
        stars,
        forks,
      } satisfies DependentInfo
    })
    .get()
    .filter((item) => item.repository !== "")
  return {
    result: dependentList,
    nextUrl,
  }
}

export type CliOptions = {
  limit?: number
  timeout?: number
}

export type GetDependentsOptions = CliOptions & {
  filter?: (item: DependentInfo) => boolean
  resume?: ParseResult | null
  silent?: boolean
}

export async function getDependents(
  target: string,
  options?: GetDependentsOptions,
) {
  const user = target.split("/")[0]
  const repo = target.split("/")[1]
  if (!user || !repo) {
    throw new Error("target should be like 'user/repo'")
  }

  const limit = options?.limit ?? 100
  const filter = options?.filter ?? ((item) => item.stars > 0)
  const timeout = options?.timeout ?? 9000
  const progressCache = options?.resume
  const enableConsole = !options?.silent

  const hasCache = !!progressCache

  let finalResult: DependentInfo[] = hasCache ? progressCache.result : []
  let currentParseResult: ParseResult = {
    result: [],
    nextUrl: hasCache
      ? progressCache.nextUrl
      : `https://github.com/${target}/network/dependents`,
  }

  if (enableConsole) {
    consola.start(`Start to parse ${target}`)
  }

  const startTime = Date.now()
  while (currentParseResult.nextUrl && Date.now() - startTime < timeout) {
    if (enableConsole) {
      consola.info(
        `Parsing page ${currentParseResult.nextUrl.split("?").at(-1)}`,
      )
    }
    currentParseResult = await parseDependents(currentParseResult.nextUrl)
    finalResult.push(...currentParseResult.result)
  }

  finalResult = finalResult
    .sort((a, b) => b.stars - a.stars)
    .filter((element) => filter(element))
    .slice(0, limit)

  if (currentParseResult.nextUrl) {
    consola.info("Exceed timeout, stop parsing")
  }

  return {
    result: finalResult,
    nextUrl: currentParseResult.nextUrl,
  }
}
