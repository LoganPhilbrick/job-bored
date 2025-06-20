// interface Job {
//   title: string;
//   description: string;
//   candidate_required_location: string;
// }

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword")?.toLowerCase() || "developer";

  const remotiveURL = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(keyword)}`;
  const adzunaURL = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${process.env.ADZUNA_ID}&app_key=${process.env.ADZUNA_API_KEY}&results_per_page=50&what_and=web%20developer&max_days_old=30&content-type=application/json`;

  try {
    const [remotiveRes, adzunaRes] = await Promise.all([fetch(remotiveURL), fetch(adzunaURL)]);

    const remotiveData = await remotiveRes.json();
    const adzunaData = await adzunaRes.json();

    interface RemotiveJob {
      id: number | string;
      title: string;
      company_name: string;
      company_logo?: string | null;
      job_type: string;
      publication_date: string;
      candidate_required_location?: string;
      salary?: string | null;
      url: string;
      description: string;
      api: string;
    }

    const normalizedRemotive = (remotiveData.jobs || []).map((job: RemotiveJob) => ({
      id: job.id.toString(),
      title: job.title,
      company_name: job.company_name,
      company_logo: job.company_logo || null,
      job_type: job.job_type,
      postedAt: job.publication_date,
      candidate_required_location: job.candidate_required_location || "Remote",
      salary: job.salary || null,
      url: job.url,
      description: job.description,
      api: "Remotive",
    }));

    interface AdzunaJob {
      id: string | number;
      title: string;
      company: {
        display_name: string;
      };
      contract_time?: string;
      created: string;
      location?: {
        display_name?: string;
      };
      salary_min?: number;
      salary_max?: number;
      redirect_url: string;
      description: string;
      api: string;
    }

    const normalizedAdzuna = (adzunaData.results || []).map((job: AdzunaJob) => ({
      id: job.id.toString(),
      title: job.title,
      company_name: job.company.display_name,
      company_logo: null, // Adzuna doesn't provide a logo
      job_type: job.contract_time || "N/A",
      postedAt: job.created,
      candidate_required_location: job.location?.display_name || "N/A",
      salary: job.salary_min && job.salary_max ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}` : null,
      url: job.redirect_url,
      description: job.description,
      api: "Adzuna",
    }));

    const combined = [...normalizedRemotive, ...normalizedAdzuna];

    const rawJobs = combined || [];

    // const excludedTerms = ["senior"];
    // const filtered = rawJobs.filter((job: Job) => {
    //   const title = job.title?.toLowerCase() || "";
    //   const description = job.description?.toLowerCase() || "";
    //   const location = job.candidate_required_location?.toLowerCase() || "";

    //   const includesKeyword = title.includes(keyword) || description.includes(keyword);
    //   const excludesBadTerms = !excludedTerms.some((term) => title.includes(term) || description.includes(term));
    //   const restrictLocation = location.includes("usa");

    //   return includesKeyword && excludesBadTerms && restrictLocation;
    // });

    return Response.json(rawJobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return new Response("Failed to fetch jobs", { status: 500 });
  }
}
