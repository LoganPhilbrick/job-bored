"use client";

import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import truncate from "html-truncate";

type Job = {
  id: string;
  title: string;
  company_name: string;
  company_logo: string;
  job_type: string;
  postedAt: string;
  candidate_required_location: string;
  salary: string | null;
  url: string;
  description: string;
  api: string;
};

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/jobs?keyword=${encodeURIComponent("developer")}`)
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        console.log("Fetched jobs:", data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading jobs...</p>;

  return (
    <div className="flex flex-col items-center justify-center gap-6 h-full mx-48">
      {jobs.map((job) => (
        <ul key={job.id} className="w-full p-6 mx-6 rounded-2xl shadow-md shadow-black/50 bg-[#171717]">
          <h2 className="text-2xl text-gray-200 font-semibold">{job.title}</h2>
          <p className="text-xl text-gray-300">
            {job.company_name} — {job.candidate_required_location}
          </p>
          <p className="text-gray-400">
            {job.job_type} | {job.salary ? `${job.salary}` : "Compensation not specified"}
          </p>
          <p>{job.api}</p>
          <p
            className="text-gray-400 mt-6"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(truncate(job.description, 360), {
                FORBID_ATTR: ["style"],
              }),
            }}
          />
          <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-sky-500 underline mt-6 inline-block">
            View Job
          </a>
        </ul>
      ))}
    </div>
  );
}
