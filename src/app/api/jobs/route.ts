import { fetchJobsFromRemotive } from "@/utils/fetchJobs";
import { saveJobs } from "@/utils/saveJobs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword") || "developer";

  const rawJobs = await fetchJobsFromRemotive(keyword);

  const filtered = rawJobs.filter((job: { title: string }) => job.title.toLowerCase().includes(keyword.toLowerCase()) && !job.title.toLowerCase().includes("senior"));

  await saveJobs(filtered);

  return Response.json(filtered);
}
