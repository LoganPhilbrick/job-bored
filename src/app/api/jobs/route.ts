export const dynamic = "force-dynamic"; // disables static cache if you're testing often
export const revalidate = 1800; // cache for 30 minutes if deployed

interface Job {
  title: string;
  description: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword")?.toLowerCase() || "developer";

  try {
    const res = await fetch(`https://remotive.com/api/remote-jobs?search=${encodeURIComponent(keyword)}`);
    const data = await res.json();

    const rawJobs = data.jobs || [];

    const excludedTerms = ["senior"];
    const filtered = rawJobs.filter((job: Job) => {
      const title = job.title?.toLowerCase() || "";
      const description = job.description?.toLowerCase() || "";

      const includesKeyword = title.includes(keyword) || description.includes(keyword);
      const excludesBadTerms = !excludedTerms.some((term) => title.includes(term) || description.includes(term));

      return includesKeyword && excludesBadTerms;
    });

    return Response.json(filtered);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return new Response("Failed to fetch jobs", { status: 500 });
  }
}
