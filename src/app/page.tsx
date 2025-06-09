"use client";

import { useEffect, useState } from "react";

type Job = {
  id: string;
  title: string;
  companyName: string;
  jobType: string;
  postedAt: string;
  location: string;
  salary: string;
  url: string;
  description: string;
};

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/jobs/from-db")
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading jobs...</p>;

  return (
    <div className="flex flex-col items-center justify-center gap-6 bg-sky-600 text-sky-600/70 rounded-3xl p-6 h-full mx-48 scrollable">
      {jobs.map((job) => (
        <ul key={job.id} className="w-full p-6 mx-6 rounded-2xl shadow-md shadow-black/50 bg-[#171717]">
          <h2 className="text-2xl text-gray-200 font-semibold">{job.title}</h2>
          <p className="text-xl text-gray-300">
            {job.companyName} — {job.location}
          </p>
          <p className="text-gray-400">
            {job.jobType} | {job.salary}
          </p>
          <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-sky-500 underline mt-6 inline-block">
            View Job
          </a>
        </ul>
      ))}
    </div>
  );
}
