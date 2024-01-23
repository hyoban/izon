"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useAtom } from "jotai"
import { atomWithLocation } from "jotai-location"
import { ChevronsUpDown } from "lucide-react"
import * as React from "react"
import useSWR from "swr"
import { Link } from "waku/router/client"

import type { queryRepositoryList } from "@/actions"

const locationAtom = atomWithLocation()

export type RepositoryList = {
  name: string
  avatarUrl: string
}[]

function RepositoryInfo({
  repository,
}: {
  repository: RepositoryList[number]
}) {
  return (
    <>
      <Avatar className="size-6 mr-2">
        <AvatarImage src={repository.avatarUrl} />
        <AvatarFallback>
          {repository.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {repository.name}
    </>
  )
}

export function GitHubRepositorySelector({
  query,
}: {
  query: typeof queryRepositoryList
}) {
  const [loc] = useAtom(locationAtom)
  const pathname = loc.pathname

  const [open, setOpen] = React.useState(false)

  const [value, setValue] = React.useState(pathname?.slice(1) ?? "")
  const [search, setSearch] = React.useState("")
  const { data: repositoryList } = useSWR(
    ["query-repository", search ? search : value],
    ([, value]: [string, string]) => query(value),
  )
  const currentRepository = repositoryList?.find(
    (repo) => repo.name.toLowerCase() === value.toLowerCase(),
  )

  React.useEffect(() => {
    if (pathname) setValue(pathname.slice(1))
  }, [pathname])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {currentRepository ? (
            <RepositoryInfo repository={currentRepository} />
          ) : value ? (
            value
          ) : (
            "Select GitHub repository"
          )}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput
            placeholder="Search GitHub repository..."
            value={search}
            onValueChange={setSearch}
          />
          {repositoryList && repositoryList.length > 0 && (
            <CommandGroup>
              {repositoryList.map((repo) => (
                <Link key={repo.name} to={`/${repo.name}`}>
                  <CommandItem
                    value={repo.name}
                    onSelect={() => {
                      setOpen(false)
                    }}
                  >
                    <RepositoryInfo repository={repo} />
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
