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
import { Suspense } from "react"

const cachePrefix = "dependents-"

function DependentTable({
  dependents,
  nextUrl,
}: {
  dependents: DependentInfo[]
  nextUrl?: string
}) {
  if (dependents.length === 0) {
    return <p className="text-xl text-muted-foreground">No dependents found.</p>
  }
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
  return (
    <DependentTable
      dependents={dependents.result.slice(0, 10)}
      nextUrl={dependents.nextUrl}
    />
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

function Introduction() {
  return (
    <article className="prose prose-neutral dark:prose-invert">
      <h2 className="text-center">Find a GitHub repository's dependents</h2>
      <p>
        GitHub provides a Dependency graph feature to view the dependents of a
        repository. The address is like{" "}
        <code className="break-all">
          https://github.com/owener/repo/network/dependents
        </code>
        . But its data does not provide an API, and we cannot sort by the number
        of stars.
      </p>
      <p>
        So I wrote Izon, a small tool that summarizes projects that rely on this
        repository by extracting relevant information from web pages. But since
        we can't get all the data in one request, dependents data may be missing
        in the Dependents Table. It will continue to fetch data as you browse
        until it is complete.
      </p>
    </article>
  )
}

export default function Page({
  params: { slug },
}: {
  params: { slug?: string[] }
}) {
  if (!slug || slug.length !== 2) {
    return <Introduction />
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
