"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useFormStatus } from "react-dom"

import { navigate } from "./navigate"

function Submit() {
  const status = useFormStatus()
  return (
    <>
      {status.pending && <div className="i-lucide-loader-2 animate-spin"></div>}
      <Button type="submit" className="mx-auto" disabled={status.pending}>
        Search
      </Button>
    </>
  )
}

export function DependentForm() {
  return (
    <form action={navigate} className="min-w-[36rem] flex gap-2 items-center">
      <Input
        placeholder="bunchee(npm package name) or huozhi/bunchee(github repo)"
        name="packageName"
        type="text"
        required
      />
      <Submit />
    </form>
  )
}
