export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword")?.toLowerCase() || "developer";
  const adzunaPage = parseInt(searchParams.get("adzunaPage") || "1");

  const remotiveURL = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(keyword)}`;
  const adzunaURL = `https://api.adzuna.com/v1/api/jobs/us/search/${adzunaPage}?app_id=${process.env.ADZUNA_ID}&app_key=${process.env.ADZUNA_API_KEY}&results_per_page=10&what_and=${encodeURIComponent(
    "web developer"
  )}&max_days_old=30&sort_by=date&content-type=application/json`;

  try {
    const [remotiveRes, adzunaRes] = await Promise.all([fetch(remotiveURL), fetch(adzunaURL)]);

    const remotiveData = await remotiveRes.json();
    const adzunaData = await adzunaRes.json();

    interface RemotiveJob {
      id: string | number;
      title: string;
      company_name: string;
      company_logo?: string;
      job_type: string;
      publication_date: string;
      candidate_required_location?: string;
      salary?: string | number | null;
      url: string;
      description: string;
    }

    const normalizedRemotive = (remotiveData.jobs || [])
      .filter((job: RemotiveJob) => new Date(job.publication_date) > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000))
      .map((job: RemotiveJob) => ({
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
      company: { display_name: string };
      contract_time?: string;
      created: string;
      location?: { display_name?: string };
      salary_min?: number;
      salary_max?: number;
      redirect_url: string;
      description: string;
    }

    const normalizedAdzuna = (adzunaData.results || []).map((job: AdzunaJob) => ({
      id: job.id.toString(),
      title: job.title,
      company_name: job.company.display_name,
      company_logo: null,
      job_type: job.contract_time || "N/A",
      postedAt: job.created,
      candidate_required_location: job.location?.display_name || "N/A",
      salary: job.salary_min && job.salary_max ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}` : null,
      url: job.redirect_url,
      description: job.description,
      api: "Adzuna",
    }));

    return Response.json({ remotive: normalizedRemotive, adzuna: normalizedAdzuna });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return new Response("Failed to fetch jobs", { status: 500 });
  }
}
