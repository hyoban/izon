"use server"

import { RepositoryList } from "@/components/github-repository-selector"
import { env } from "@/env.mjs"
import { kv } from "@/lib/storage"

export async function queryRepositoryList(
  query?: string,
): Promise<RepositoryList> {
  // return history
  if (!query) {
    const repositoryList = (await kv.getKeys())
      .map((key) => key.slice("dependents-".length).replace(":", "/"))
      .map((name) => ({
        name,
        avatarUrl: "",
      }))
      // random select 5
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
    return repositoryList
  }

  const repositoryList = await fetch(
    `https://api.github.com/search/repositories?per_page=5&q=${query}`,
    {
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      },
    },
  )
    .then((res) => res.json())
    .then((res) => {
      return res.items.map((item: any) => ({
        name: item.full_name,
        avatarUrl: item.owner.avatar_url,
      }))
    })
  return repositoryList
}
