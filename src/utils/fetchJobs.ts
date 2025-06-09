export async function fetchJobsFromRemotive(keyword: string) {
  const encodedKeyword = encodeURIComponent(keyword);
  const res = await fetch(`https://remotive.com/api/remote-jobs?search=${encodedKeyword}`);
  const data = await res.json();
  return data.jobs;
}
