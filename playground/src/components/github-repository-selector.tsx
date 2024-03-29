"use client"

import { queryRepositoryList } from "@/app/actions"
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
import { ChevronsUpDown } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import * as React from "react"
import useSWR from "swr"

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

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

export function GitHubRepositorySelector() {
  const router = useRouter()
  const pathname = usePathname()

  const [open, setOpen] = React.useState(false)

  const [value, setValue] = React.useState(pathname.slice(1))
  const [search, setSearch] = React.useState("")
  const { data: repositoryList } = useSWR(
    ["query-repository", search ? search : value],
    ([, value]: [string, string]) => queryRepositoryList(value),
  )
  const currentRepository = repositoryList?.find(
    (repo) => repo.name.toLowerCase() === value.toLowerCase(),
  )

  React.useEffect(() => {
    setValue(pathname.slice(1))
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
                <CommandItem
                  key={repo.name}
                  value={repo.name}
                  onSelect={(currentValue) => {
                    setOpen(false)
                    router.push(`/${currentValue}`)
                  }}
                >
                  <RepositoryInfo repository={repo} />
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
