"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useFormStatus } from "react-dom"

import { navigate } from "./navigate"

function Submit() {
  const status = useFormStatus()
  return (
    <Button type="submit" disabled={status.pending}>
      {status.pending ? (
        <div className="i-lucide-loader-2 animate-spin" />
      ) : (
        "Search"
      )}
    </Button>
  )
}

export function DependentForm() {
  return (
    <form
      action={navigate}
      className="flex gap-4 items-center justify-center mx-auto"
    >
      <Input
        placeholder="Input a github repo like user/repo"
        name="packageName"
        type="text"
        required
        className="w-60"
      />
      <Submit />
    </form>
  )
}
