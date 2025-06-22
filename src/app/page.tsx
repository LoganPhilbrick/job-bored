"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import truncate from "html-truncate";

const apiOptions = ["Remotive", "Adzuna"];
const itemsPerPage = 10;

type Job = {
  id: string;
  title: string;
  company_name: string;
  company_logo: string | null;
  job_type: string;
  postedAt: string;
  candidate_required_location: string;
  salary: string | null;
  url: string;
  description: string;
  api: string;
};

type JobResponse = {
  remotive: Job[];
  adzuna: Job[];
};

const fetchJobs = async (api: string, page: number): Promise<JobResponse> => {
  const res = await fetch(`/api/jobs?adzunaPage=${page}`);
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
};

export default function Home() {
  const [selected, setSelected] = useState("Remotive");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["jobs", selected, currentPage],
    queryFn: () => fetchJobs(selected, selected === "Adzuna" ? currentPage : 1),
    staleTime: 1000 * 60 * 30,
    placeholderData: (prevData) => prevData,
  });

  const selectedJobs: Job[] = selected === "Remotive" ? data?.remotive || [] : data?.adzuna || [];

  const totalPages = selected === "Remotive" ? Math.ceil(selectedJobs.length / itemsPerPage) : currentPage + 1;

  const paginatedJobs = selected === "Remotive" ? selectedJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : selectedJobs;

  const handleSourceChange = (api: string) => {
    setSelected(api);
    setCurrentPage(1);
  };

  if (isLoading) return <p>Loading jobs...</p>;
  if (isError) return <p>Failed to load jobs.</p>;

  return (
    <div className="flex flex-col items-center justify-center gap-6 h-full mx-48">
      {/* API Filter Buttons */}
      <div className="flex gap-2 bg-gray-800 rounded-xl p-1">
        {apiOptions.map((api) => (
          <button
            key={api}
            onClick={() => handleSourceChange(api)}
            className={`px-4 py-2 rounded-xl transition-colors duration-300 ${selected === api ? "bg-blue-600 text-white" : "bg-transparent text-gray-300"}`}
          >
            {api}
          </button>
        ))}
      </div>

      {isFetching && !isLoading ? (
        <p className="text-gray-400 italic mb-4">Loading new page...</p>
      ) : (
        <>
          {/* Pagination Controls */}
          {paginatedJobs.length > 0 && (
            <div className="flex gap-4 mt-6">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 rounded bg-gray-700 text-white disabled:opacity-50">
                Prev
              </button>
              <span className="text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={selected === "Remotive" && currentPage === totalPages}
                className="px-4 py-2 rounded bg-gray-700 text-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
          {/* Job List */}
          {paginatedJobs.map((job: Job) => (
            <ul key={job.id} className="w-full p-6 mx-6 rounded-2xl shadow-md shadow-black/50 bg-[#171717]">
              <h2 className="text-2xl text-gray-200 font-semibold">{job.title}</h2>
              <p className="text-xl text-gray-300">
                {job.company_name} — {job.candidate_required_location}
              </p>
              <p className="text-gray-400">
                {job.job_type} | {job.salary ? job.salary : "Compensation not specified"}
              </p>
              <p className="text-gray-400">{job.postedAt}</p>
              <p className="text-sm text-gray-500 italic">{job.api}</p>
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
        </>
      )}
    </div>
  );
}
