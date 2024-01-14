import { load } from "cheerio"
import { $fetch } from "ofetch"

export interface NpmPackageInfo {
  repository: {
    type: string
    url: string
  }
}

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

async function getNpmPackageGithubRepo(packageName: string) {
  return await $fetch<NpmPackageInfo>(
    `https://registry.npmjs.org/${packageName}`,
  )
    .then(
      (result) =>
        // extract github repo xxx/xxx from url
        result.repository.url.match(/github.com\/(.*)\.git/)?.[1],
    )
    .then((result) => {
      if (!result && !result?.match(/^[^/]+\/[^/]+$/)) {
        throw new Error("can not find github repo")
      }
      return result
    })
}

export async function getDependents(
  target: string,
  options?: {
    limit?: number
    filter?: (item: DependentInfo) => boolean
    maxPage?: number
  },
) {
  const limit = options?.limit ?? 50
  const filter = options?.filter ?? ((item) => item.stars > 0)
  const githubRepo = target.includes("/")
    ? target
    : await getNpmPackageGithubRepo(target)
  const finalResult: DependentInfo[] = []
  let currentParseResult: ParseResult = {
    result: [],
    nextUrl: `https://github.com/${githubRepo}/network/dependents`,
  }
  let maxPage = options?.maxPage ?? 50
  while (currentParseResult.nextUrl && maxPage-- > 0) {
    currentParseResult = await parseDependents(currentParseResult.nextUrl)
    finalResult.push(...currentParseResult.result)
  }
  return finalResult
    .sort((a, b) => b.stars - a.stars)
    .filter((element) => filter(element))
    .slice(0, limit)
}
