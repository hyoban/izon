import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DependentInfo, getDependents } from "izon"
import { unstable_cache } from "next/cache"
import { Suspense } from "react"

const cachedGetDependents = unstable_cache(
  async (packageName) => {
    return await getDependents(packageName)
  },
  ["getDependents"],
)

function DependentTable({ dependents }: { dependents: DependentInfo[] }) {
  return (
    <Table>
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
  const dependents = await cachedGetDependents(packageName)
  return <DependentTable dependents={dependents.slice(0, 10)} />
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
        <p className="text-xl text-muted-foreground">
          Find package's dependents
        </p>
      </>
    )
  }

  const packageName = slug.join("/")
  return (
    <>
      <p className="text-xl text-muted-foreground">
        Find what projects are using {packageName}
      </p>
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
    </>
  )
}
