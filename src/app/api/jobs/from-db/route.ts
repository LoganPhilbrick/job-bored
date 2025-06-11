import { prisma } from "@/lib/prisma";

export async function GET() {
  const jobs = await prisma.job.findMany({
    orderBy: {
      postedAt: "desc",
    },
    take: 50, // just show recent ones
  });

  return Response.json(jobs);
}
