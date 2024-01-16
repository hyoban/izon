import { kv } from "@/lib/storage"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

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
    return Response.json(repositoryList)
  }

  const repositoryList = await fetch(
    `https://api.github.com/search/repositories?per_page=5&q=${query}`,
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
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
  return Response.json(repositoryList)
}
