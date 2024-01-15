import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { kv } from "@/lib/storage"
import { cn } from "@/lib/utils"
import { DependentInfo, getDependents, ParseResult } from "izon"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import { Suspense } from "react"

const cachePrefix = "dependents-"

function DependentTable({
  dependents,
  nextUrl,
}: {
  dependents: DependentInfo[]
  nextUrl?: string
}) {
  return (
    <Table className="md:min-w-[30rem]">
      {!!nextUrl && (
        <TableCaption> Still have more, refresh to fetch. </TableCaption>
      )}
      <TableHeader>
        <TableRow>
          <TableHead>Repository</TableHead>
          <TableHead>Stars</TableHead>
          <TableHead>Forks</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dependents.map((dependent) => {
          return (
            <TableRow key={dependent.repository}>
              <TableCell>
                <a
                  href={`https://github.com/${dependent.repository}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {dependent.repository.length > 25
                    ? dependent.repository.split("/").at(-1)
                    : dependent.repository}
                </a>
              </TableCell>
              <TableCell>{dependent.stars}</TableCell>
              <TableCell>{dependent.forks}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

async function Dependents({ packageName }: { packageName: string }) {
  const cached = await kv.getItem<ParseResult>(`${cachePrefix}${packageName}`)
  const dependents = await getDependents(packageName, {
    resume: cached,
  })
  kv.setItem(`${cachePrefix}${packageName}`, dependents)
  revalidatePath("/")
  return (
    <DependentTable
      dependents={dependents.result.slice(0, 10)}
      nextUrl={dependents.nextUrl}
    />
  )
}

async function CacheStatus({ repo }: { repo: string }) {
  const cache = await kv.getItem<ParseResult>(`${cachePrefix}${repo}`)
  return (
    !cache?.nextUrl && (
      <Badge variant="outline" className="shrink-0 h-min">
        Ready
      </Badge>
    )
  )
}

async function ExampleRepositoryList() {
  const keys = await kv.getKeys()
  const selectedKeys = keys
    .sort(() => Math.random() - 0.5)
    .slice(0, 20)
    .map((key) => key.replace(":", "/"))

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[auto,auto] gap-4 items-center">
      {selectedKeys.map((key) => {
        const repo = key.slice(cachePrefix.length)
        return (
          <div className="flex gap-2 items-center max-sm:odd:hidden" key={key}>
            <Link className="underline" href={`/${repo}`}>
              {repo.length > 25 ? repo.split("/").at(-1) : repo}
            </Link>
            <Suspense>
              <CacheStatus repo={repo} />
            </Suspense>
          </div>
        )
      })}
    </div>
  )
}

function Loading({ className }: { className?: string }) {
  return (
    <div className={cn("flex gap-2", className)}>
      <div className="i-lucide-loader-2 animate-spin" />
      Fetching...
    </div>
  )
}

export default function Page({
  params: { slug },
}: {
  params: { slug?: string[] }
}) {
  if (!slug || slug.length !== 2) {
    return (
      <div className="space-y-6">
        <p className="text-xl text-muted-foreground text-center">
          Find a github repository's dependents.
        </p>

        <Suspense fallback={<Loading />}>
          <ExampleRepositoryList />
        </Suspense>
      </div>
    )
  }

  const packageName = slug.join("/")
  return (
    <div className="flex h-full w-full justify-center items-center">
      <Suspense fallback={<Loading />}>
        <Dependents packageName={packageName} />
      </Suspense>
    </div>
  )
}
