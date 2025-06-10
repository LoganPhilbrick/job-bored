import { fetchJobsFromRemotive } from "@/utils/fetchJobs";
import { saveJobs } from "@/utils/saveJobs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword") || "developer";

  const excludedKeywords = ["senior", "sr"];

  const rawJobs = await fetchJobsFromRemotive(keyword);

  const filtered = rawJobs.filter((job: { title: string; description: string; candidate_required_location: string }) => {
    const title = job.title?.toLowerCase() || "";
    const description = job.description?.toLowerCase() || "";
    const location = job.candidate_required_location || "";

    const checkTitleDesc = title.includes(keyword.toLowerCase()) || description.includes(keyword.toLowerCase());
    const checkLocal = location.includes("USA");
    const containsExcludedWord = excludedKeywords.some((excluded) => title.includes(excluded));

    return checkTitleDesc && checkLocal && !containsExcludedWord;
  });

  await saveJobs(filtered);

  return Response.json(filtered);
}
