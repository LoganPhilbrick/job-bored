interface Job {
  title: string;
  description: string;
  candidate_required_location: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword")?.toLowerCase() || "developer";

  try {
    const res = await fetch(`https://remotive.com/api/remote-jobs?search=${encodeURIComponent(keyword)}`, { next: { revalidate: 1800 } });
    // http://api.adzuna.com/v1/api/jobs/us/search/1?app_id=ed545af7&app_key=39dddeaf676c90d6c49e932724ac7bde&results_per_page=20&what=javascript%20developer&content-type=application/json - adzuna API example

    const data = await res.json();

    const rawJobs = data.jobs || [];

    const excludedTerms = ["senior"];
    const filtered = rawJobs.filter((job: Job) => {
      const title = job.title?.toLowerCase() || "";
      const description = job.description?.toLowerCase() || "";
      const location = job.candidate_required_location?.toLowerCase() || "";

      const includesKeyword = title.includes(keyword) || description.includes(keyword);
      const excludesBadTerms = !excludedTerms.some((term) => title.includes(term) || description.includes(term));
      const restrictLocation = location.includes("usa");

      return includesKeyword && excludesBadTerms && restrictLocation;
    });

    return Response.json(filtered);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return new Response("Failed to fetch jobs", { status: 500 });
  }
}
