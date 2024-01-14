"use server"

import { redirect } from "next/navigation"

export async function navigate(formData: FormData) {
  const packageName = formData.get("packageName") as string
  if (!packageName) return
  redirect(`/${packageName}`)
}
