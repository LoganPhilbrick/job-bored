import { prisma } from "@/lib/prisma";

interface Job {
  title: string;
  company_name: string;
  url: string;
  job_type: string;
  publication_date: string;
  candidate_required_location: string;
  salary?: string;
  description: string;
}

export async function saveJobs(jobs: Job[]) {
  for (const job of jobs) {
    try {
      await prisma.job.create({
        data: {
          title: job.title,
          companyName: job.company_name,
          url: job.url,
          jobType: job.job_type,
          postedAt: new Date(job.publication_date),
          location: job.candidate_required_location,
          salary: job.salary || "Not specified",
          description: job.description,
        },
      });
    } catch (e: unknown) {
      // Only skip "duplicate URL" errors
      if (typeof e === "object" && e !== null && "code" in e && (e as { code?: string }).code !== "P2002") {
        console.error(e);
      }
    }
  }
}
