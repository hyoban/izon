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
import { DependentInfo, getDependents, ParseResult } from "izon"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import { Suspense } from "react"

import { DependentForm } from "./dependent-form"

const cachePrefix = "dependents-"

function DependentTable({
  dependents,
  packageName,
  nextUrl,
}: {
  dependents: DependentInfo[]
  packageName: string
  nextUrl?: string
}) {
  return (
    <Table className="md:min-w-[30rem]">
      <TableCaption>
        <div className="flex flex-wrap items-center justify-center text-balance">
          <span>
            <a
              href={`https://github.com/${packageName}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {packageName}
            </a>
            's dependents.
          </span>
          {!!nextUrl && <span> Still have more, refresh to fetch.</span>}
        </div>
      </TableCaption>
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
      packageName={packageName}
      nextUrl={dependents.nextUrl}
    />
  )
}

async function ExampleRepository() {
  const keys = await kv.getKeys()
  const selectedKeys = keys
    .sort(() => Math.random() - 0.5)
    .slice(0, 20)
    .map((key) => key.replace(":", "/"))
  const cached = await Promise.all(
    selectedKeys.map((key) => kv.getItem<ParseResult>(key)),
  )

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-[auto,auto] gap-4 items-center">
      {selectedKeys.map((key, index) => {
        const repo = key.slice(cachePrefix.length)
        return (
          <div className="flex gap-2 items-center max-sm:odd:hidden" key={key}>
            <Link className="underline" href={`/${repo}`}>
              {repo.length > 25 ? repo.split("/").at(-1) : repo}
            </Link>
            {!cached[index]?.nextUrl && (
              <Badge variant="outline" className="shrink-0 h-min">
                Ready
              </Badge>
            )}
          </div>
        )
      })}
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
      <>
        <p className="text-xl text-muted-foreground text-center mb-10">
          Find a github repository's dependents.
        </p>
        <DependentForm />
        <ExampleRepository />
      </>
    )
  }

  const packageName = slug.join("/")
  return (
    <div className="flex h-full w-full justify-center items-center">
      <Suspense
        fallback={
          <div className="flex h-full w-full justify-center items-center gap-2">
            <div className="i-lucide-loader-2 animate-spin" />
            Fetching...
          </div>
        }
      >
        <Dependents packageName={packageName} />
      </Suspense>
    </div>
  )
}
