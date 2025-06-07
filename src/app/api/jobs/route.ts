import { fetchJobsFromRemotive } from "@/utils/fetchJobs";
import { saveJobs } from "@/utils/saveJobs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword") || "developer";

  const jobs = await fetchJobsFromRemotive(keyword);
  await saveJobs(jobs);

  const filtered = jobs.filter((job: { title: string }) => job.title.toLowerCase().includes(keyword.toLowerCase()) && !job.title.toLowerCase().includes("senior"));

  return Response.json(filtered);
}
