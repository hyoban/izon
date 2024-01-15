export const dynamic = "force-dynamic" // defaults to auto
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  if (!query) return new Response("No query provided", { status: 400 })

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
