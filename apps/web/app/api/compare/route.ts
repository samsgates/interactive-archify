import { diffArchitectures } from '@interactive-archify/core'; export async function POST(req:Request){const {before,after}=await req.json();return Response.json(diffArchitectures(before,after))}
