import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { kv } from "@vercel/kv"
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
        <div className="flex flex-wrap items-center justify-center">
          <a
            href={`https://github.com/${packageName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {packageName}
          </a>
          's dependents.
          {!!nextUrl && <> Still have more, refresh to fetch.</>}
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
                  {dependent.repository}
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
  const cached = await kv.get<ParseResult>(`${cachePrefix}${packageName}`)
  const dependents = await getDependents(packageName, {
    resume: cached,
  })
  kv.set(`${cachePrefix}${packageName}`, dependents)
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
  const keys = await kv.keys(`${cachePrefix}*`)
  const selectedKeys = keys.sort(() => Math.random() - 0.5).slice(0, 20)

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
      {selectedKeys.map((key) => {
        return (
          <Link
            key={key}
            className="my-2 underline block max-sm:odd:hidden"
            href={`/${key.slice(cachePrefix.length)}`}
          >
            {key.slice(cachePrefix.length)}
          </Link>
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
  console.log(slug)
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
          <div className="flex h-full w-full justify-center items-center">
            <div className="i-lucide-loader-2 animate-spin" />
          </div>
        }
      >
        <Dependents packageName={packageName} />
      </Suspense>
    </div>
  )
}
