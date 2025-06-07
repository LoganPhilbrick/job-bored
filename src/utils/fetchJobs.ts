export async function fetchJobsFromRemotive(keyword: string) {
  const res = await fetch(`https://remotive.com/api/remote-jobs?search=${keyword}`);
  const data = await res.json();
  return data.jobs;
}
