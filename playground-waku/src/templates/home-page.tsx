export function HomePage() {
  return (
    <article className="prose prose-neutral dark:prose-invert">
      <h2 className="text-center">
        Find a GitHub repository&apos;s dependents
      </h2>
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
        we can&apos;t get all the data in one request, dependents data may be
        missing in the Dependents Table. It will continue to fetch data as you
        browse until it is complete.
      </p>
      <p>
        You can also use <code>npx izon user/repo</code> to get the dependents
        locally.
      </p>
    </article>
  )
}
