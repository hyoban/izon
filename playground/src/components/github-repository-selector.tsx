"use client"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
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

type RepositoryList = {
  name: string
  avatarUrl: string
}[]

export function GitHubRepositorySelector() {
  const router = useRouter()
  const pathname = usePathname()

  const [open, setOpen] = React.useState(false)

  const [value, setValue] = React.useState(pathname.slice(1))
  const [search, setSearch] = React.useState("")
  const { data: repositoryList } = useSWR<RepositoryList>(
    !!search ? search : value,
    async (query: string) => {
      return fetch(
        `https://api.github.com/search/repositories?per_page=5&q=${query}`,
      )
        .then((res) => res.json())
        .then((res) => {
          return res.items.map((item: any) => ({
            name: item.full_name,
            avatarUrl: item.owner.avatar_url,
          }))
        })
    },
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
          {repositoryList?.find((repo) => repo.name === value)?.name ??
            "Select GitHub repository"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput
            placeholder="Search GitHub repository..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandEmpty>No results</CommandEmpty>
          {repositoryList && repositoryList?.length > 0 && (
            <CommandGroup>
              {repositoryList?.map((repo) => (
                <CommandItem
                  key={repo.name}
                  value={repo.name}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    router.push(`/${currentValue}`)
                  }}
                >
                  <Avatar className="size-6 mr-2">
                    <AvatarImage src={repo.avatarUrl} />
                    <AvatarFallback>
                      {repo.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {repo.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
