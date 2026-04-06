import { auth } from "@/auth"
import HeaderClient from "./HeaderClient"

export default async function HeaderServer() {
  const session = await auth()
  
  return <HeaderClient session={session} />
}