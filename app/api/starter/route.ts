import { getStarter } from "@/lib/starter"

export async function GET() { return Response.json(await getStarter()) }
