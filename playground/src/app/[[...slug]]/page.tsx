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
import { Suspense } from "react"

import { DependentForm } from "./dependent-form"

const cachePrefix = "dependents-"

function DependentTable({
  dependents,
  packageName,
}: {
  dependents: DependentInfo[]
  packageName: string
}) {
  return (
    <Table className="min-w-[30rem]">
      <TableCaption>
        <a
          href={`https://github.com/${packageName}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {packageName}
        </a>
        's dependents
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
  if (cached) console.log(`Using cached result for ${packageName}`)
  const dependents = await getDependents(packageName, {
    resume: cached,
  })
  kv.set(`${cachePrefix}${packageName}`, dependents)
  return (
    <DependentTable
      dependents={dependents.result.slice(0, 10)}
      packageName={packageName}
    />
  )
}

export default function Page({
  params: { slug },
}: {
  params: { slug?: string[] }
}) {
  console.log(slug)
  if (!slug || (slug.length !== 1 && slug.length !== 2)) {
    return (
      <>
        <p className="text-xl text-muted-foreground text-center mb-10">
          Find package's dependents
        </p>
        <DependentForm />
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
